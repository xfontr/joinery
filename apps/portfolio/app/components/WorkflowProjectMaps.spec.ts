import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { ProjectMap } from "~/types/ProjectMap";
import type { SiteData } from "~/types/SiteData";
import WorkflowProjectMaps from "./WorkflowProjectMaps.vue";

const DATA_URL = "https://portal.test/embed/data.json";

const map = (blocks: ProjectMap["blocks"]) =>
    ({
        stages: [],
        nodes: [],
        edges: [],
        width: 0,
        height: 0,
        nodeWidth: 164,
        nodeHeight: 30,
        blocks,
        tickets: null,
    }) satisfies ProjectMap;

const open = async (blocks: ProjectMap["blocks"]) => {
    serveEndpoint(
        DATA_URL,
        () =>
            ({
                benchmarks: [],
                decisions: [],
                workflows: {
                    projects: [{ id: "blog", title: "Blog", map: map(blocks), glyph: map(blocks) }],
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
        agenticWorkflows: { projects: { done: "{percent}% done" } },
    });
});

afterEach(() => {
    useRuntimeConfig().public.dataUrl = "";
});

describe("WorkflowProjectMaps", () => {
    it("states the share of blocks done, rounded to a whole percent", async () => {
        const wrapper = await open({ done: 2, moving: 1, total: 3 });

        expect(wrapper.text()).toContain("67% done");
    });

    it("states 0% for a map with no blocks yet, rather than an empty figure", async () => {
        const wrapper = await open({ done: 0, moving: 0, total: 0 });

        expect(wrapper.text()).toContain("0% done");
    });

    it("sends each map to its project's page on the developer portal", async () => {
        const wrapper = await open({ done: 0, moving: 1, total: 1 });

        expect(wrapper.get("article a").attributes("href")).toBe(portalUrl("/workflows/blog"));
    });
});
