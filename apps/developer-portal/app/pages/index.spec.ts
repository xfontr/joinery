import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LintRuleUsage } from "#layers/snapshot/shared/types/LintRuleUsage.ts";
import type { SnapshotResponse } from "#layers/snapshot/shared/types/SnapshotResponse.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Page from "./index.vue";

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
        { id: "discovery", title: "Discovery" },
        { id: "build", title: "Build" },
    ],
    capabilities: [
        { id: "audit", stage: "discovery", title: "Content audit" },
        { id: "page", stage: "build", title: "Article page", dependsOn: ["audit"] },
    ],
};

const rule = (enabled: boolean): LintRuleUsage => ({
    enabled,
    hits: 0,
    recent: 0,
    fixable: 0,
    last: null,
    projects: {},
    disabled: 0,
});

const USAGE: UsageArtifact = {
    generatedAt: "2026-11-01T00:00:00Z",
    windowDays: 30,
    known: [],
    scripts: {},
    lint: {
        since: null,
        rules: {
            "no-console": rule(true),
            "monorepo/no-build-step": rule(true),
            "monorepo/retired": rule(false),
        },
    },
};

const open = async ({
    usage = null as UsageArtifact | null,
    projects = [] as { id: string; title: string }[],
} = {}) => {
    serveEndpoint("/api/snapshot/usage", (): SnapshotResponse => ({ manifest: null, usage }));
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
    const wrapper = await mountSuspended(Page);
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    docs.benchmarks = [];
});

describe("front page", () => {
    it("states every proof without a number when nothing was ever collected", async () => {
        const wrapper = await open();

        expect(wrapper.findAll("article")).toHaveLength(9);
        expect(wrapper.text()).toContain("The sites studied before anything was drawn");
        expect(wrapper.text()).toContain("What the machines check on every change");
        expect(wrapper.find("[data-workflow-glyph]").exists()).toBe(false);
    });

    it("counts only switched-on lint rules, and the in-house ones among them", async () => {
        const wrapper = await open({ usage: USAGE });

        expect(wrapper.text()).toContain("2 lint rules on every change, 1 written in-house");
    });

    it("counts the benchmarked sites from docs/benchmarks", async () => {
        docs.benchmarks = [
            { path: "/docs/benchmarks/rauno-me", title: "rauno.me" },
            { path: "/docs/benchmarks/primer-style", title: "primer.style" },
            { path: "/docs/benchmarks/readme", title: "Benchmarks" },
        ];
        const wrapper = await open();

        expect(wrapper.text()).toContain("2 sites studied");
    });

    it("draws Huella Legal's plan as the glyph that leads to how projects are run", async () => {
        const wrapper = await open({ projects: [{ id: "huella-legal", title: "Huella Legal" }] });

        const link = wrapper.find("#workflows a");
        expect(link.attributes("href")).toBe("/agentic-workflows");
        expect(link.findAll("[data-workflow-glyph] rect")).toHaveLength(2);
    });

    it("sends the reader who wants everything to the developer view", async () => {
        const wrapper = await open();

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toContain("/overview");
        expect(links).not.toContain("/");
    });
});
