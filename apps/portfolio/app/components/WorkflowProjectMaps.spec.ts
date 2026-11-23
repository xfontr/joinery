import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { ProjectMap } from "~/types/ProjectMap";
import type { SiteData } from "~/types/SiteData";
import WorkflowProjectMaps from "./WorkflowProjectMaps.vue";

const DATA_URL = "https://portal.test/embed/data.json";

const map = (tickets: ProjectMap["tickets"]) =>
    ({
        stages: [],
        nodes: [],
        edges: [],
        width: 0,
        height: 0,
        nodeWidth: 164,
        nodeHeight: 30,
        blocks: { done: 0, moving: 1, total: 1 },
        tickets,
    }) satisfies ProjectMap;

const open = async (tickets: ProjectMap["tickets"]) => {
    serveEndpoint(
        DATA_URL,
        () =>
            ({
                benchmarks: [],
                decisions: [],
                workflows: {
                    projects: [{ id: "blog", title: "Blog", map: map(tickets), glyph: map(null) }],
                    templates: [],
                    lessons: 0,
                },
                rules: null,
                specs: null,
            }) satisfies SiteData,
    );
    const wrapper = await mountSuspended(WorkflowProjectMaps);
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    useRuntimeConfig().public.dataUrl = DATA_URL;
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

afterEach(() => {
    useRuntimeConfig().public.dataUrl = "";
});

describe("WorkflowProjectMaps", () => {
    it("says nothing about tickets for a project that was never synced", async () => {
        const wrapper = await open(null);

        expect(wrapper.text()).toContain("0/1 blocks");
        expect(wrapper.text()).not.toContain("tickets");
    });

    it("counts a synced project's closed tickets", async () => {
        const wrapper = await open({ closed: 1, total: 1 });

        expect(wrapper.text()).toContain("1/1 tickets");
    });

    it("sends each map to its project's page on the developer portal", async () => {
        const wrapper = await open(null);

        expect(wrapper.get("article a").attributes("href")).toBe(portalUrl("/workflows/blog"));
    });
});
