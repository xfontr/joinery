import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { assembleWorkflows, type Workflows } from "#layers/workflows/shared/workflows.ts";
import WorkflowProjectMaps from "./WorkflowProjectMaps.vue";

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
    const wrapper = await mountSuspended(WorkflowProjectMaps);
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    const { $i18n } = useNuxtApp();
    $i18n.mergeLocaleMessage($i18n.locale.value, {
        agenticWorkflows: {
            projects: {
                blocks: "{done}/{total} blocks",
                tickets: "{blocks}; {closed}/{total} tickets",
            },
        },
    });
});

describe("WorkflowProjectMaps", () => {
    it("says nothing about tickets for a project that was never synced", async () => {
        const wrapper = await open(workflows());

        expect(wrapper.text()).toContain("0/1 blocks");
        expect(wrapper.text()).not.toContain("tickets");
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

        expect(wrapper.text()).toContain("1/1 tickets");
    });
});
