import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { assembleWorkflows, type Workflows } from "#layers/workflows/shared/workflows.ts";
import Page from "./agentic-workflows.vue";

const TEMPLATE = {
    id: "website-rebuild",
    title: "Website rebuild",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [{ id: "article-page", stage: "build", title: "Article page" }],
};

const PROJECTS = [
    { id: "blog", title: "Blog", template: "website-rebuild", milestone: "Blog" },
    { id: "shop", title: "Shop", template: "website-rebuild", milestone: "Shop" },
];

const workflows = (snapshots = {}) =>
    assembleWorkflows(
        [{ file: "website-rebuild.yaml", ok: true, value: TEMPLATE }],
        PROJECTS.map((value) => ({ file: `${value.id}.yaml`, ok: true, value })),
        snapshots,
    );

const open = async (data: Workflows) => {
    serveEndpoint("/api/workflows", () => data);
    const wrapper = await mountSuspended(Page);
    await flushPromises();
    return wrapper;
};

describe("agentic workflows page", () => {
    it("links every project in data/workflows to its own developer page", async () => {
        const wrapper = await open(workflows());

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toEqual(expect.arrayContaining(["/workflows/blog", "/workflows/shop"]));
    });

    it("says nothing about tickets for a project that was never synced", async () => {
        const wrapper = await open(workflows());

        expect(wrapper.text()).toContain("0 of 1 blocks done");
        expect(wrapper.text()).not.toContain("tickets closed");
    });

    it("counts a synced project's closed tickets", async () => {
        const wrapper = await open(
            workflows({
                blog: {
                    file: "blog.snapshot.json",
                    ok: true,
                    value: {
                        syncedAt: "2026-11-09T00:00:00Z",
                        milestone: "Blog",
                        issues: [
                            {
                                number: 1,
                                title: "T",
                                url: "",
                                state: "closed",
                                reason: "completed",
                                caps: ["article-page"],
                                createdAt: null,
                                closedAt: "2026-11-01T00:00:00Z",
                                activity: [],
                                blockedBy: [],
                                branch: false,
                                pr: false,
                                owner: false,
                                complexity: null,
                            },
                        ],
                        noMilestone: [],
                    },
                },
            }),
        );

        expect(wrapper.text()).toContain("1 of 1 tickets closed");
    });
});
