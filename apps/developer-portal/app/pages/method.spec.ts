import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Page from "./method.vue";

const docs = vi.hoisted(() => ({ benchmarks: [] as { path: string; title: string }[] }));

mockNuxtImport("queryCollection", () => () => {
    const query = {
        where: () => query,
        select: () => query,
        all: () => Promise.resolve(docs.benchmarks),
    };
    return query;
});

const TEMPLATE = {
    id: "website-rebuild",
    title: "Website rebuild",
    stages: [
        { id: "discovery", title: "Discovery", goal: "Know what the old site holds." },
        { id: "launch", title: "Launch", goal: "No old link breaks." },
    ],
    capabilities: [{ id: "url-inventory", stage: "discovery", title: "URL inventory" }],
};

const serveWorkflows = (projects: { id: string; title: string }[]) =>
    serveEndpoint("/api/workflows", () =>
        assembleWorkflows(
            [{ file: "website-rebuild.yaml", ok: true, value: TEMPLATE }],
            projects.map((project) => ({
                file: `${project.id}.yaml`,
                ok: true,
                value: { ...project, template: "website-rebuild", milestone: project.title },
            })),
            {},
        ),
    );

const open = async () => {
    const wrapper = await mountSuspended(Page);
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    docs.benchmarks = [];
});

describe("method page", () => {
    it("lays Huella Legal's plan out stage by stage from its workflow", async () => {
        serveWorkflows([{ id: "huella-legal", title: "Huella Legal" }]);
        const wrapper = await open();

        expect(wrapper.text()).toContain("Huella Legal's rebuild, in 2 stages.");
        expect(wrapper.findAll("ol")[0]!.text()).toContain("Discovery");
        expect(wrapper.findAll("ol")[0]!.text()).toContain("No old link breaks.");
    });

    it("drops the stage count when Huella Legal has no workflow", async () => {
        serveWorkflows([{ id: "blog", title: "Blog" }]);
        const wrapper = await open();

        expect(wrapper.text()).toContain("Huella Legal's rebuild, mapped before the first ticket.");
        expect(wrapper.text()).not.toContain("Discovery");
    });

    it("counts and names the benchmarked sites from docs/benchmarks", async () => {
        docs.benchmarks = [
            { path: "/docs/benchmarks/rauno-me", title: "rauno.me" },
            { path: "/docs/benchmarks/primer-style", title: "primer.style" },
            { path: "/docs/benchmarks/readme", title: "Benchmarks" },
        ];
        serveWorkflows([]);
        const wrapper = await open();

        expect(wrapper.text()).toContain("2 sites from juried galleries");
        expect(wrapper.text()).toContain("primer.style · rauno.me");
    });

    it("links each written-down decision to its developer page", async () => {
        serveWorkflows([]);
        const wrapper = await open();

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toEqual(
            expect.arrayContaining([
                "/decisions/0028-huella-legal-urls-and-cutover",
                "/decisions/0040-developer-portal-visitor-structure",
            ]),
        );
    });
});
