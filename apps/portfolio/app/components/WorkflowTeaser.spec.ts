import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { ProjectMap } from "~/types/ProjectMap";
import type { SiteData } from "~/types/SiteData";
import WorkflowTeaser from "./WorkflowTeaser.vue";

const DATA_URL = "https://portal.test/embed/data.json";

const MAP = {
    stages: [],
    nodes: [
        { id: "audit", title: "Audit", label: "Audit", tone: "done", owner: false, x: 0, y: 0 },
        { id: "page", title: "Page", label: "Page", tone: "moving", owner: false, x: 52, y: 0 },
    ],
    edges: [],
    width: 62,
    height: 16,
    nodeWidth: 10,
    nodeHeight: 10,
    blocks: { done: 1, moving: 1, total: 2 },
    tickets: null,
} satisfies ProjectMap;

const open = async (projectId: string) => {
    serveEndpoint(
        DATA_URL,
        () =>
            ({
                benchmarks: [],
                decisions: [],
                workflows: {
                    projects: [{ id: projectId, title: projectId, map: MAP, glyph: MAP }],
                    templates: [],
                    lessons: 0,
                },
                rules: null,
                specs: null,
            }) satisfies SiteData,
    );
    const wrapper = await mountSuspended(WorkflowTeaser);
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    useRuntimeConfig().public.dataUrl = DATA_URL;
});

afterEach(() => {
    useRuntimeConfig().public.dataUrl = "";
});

describe("WorkflowTeaser", () => {
    it("draws Huella Legal's plan as the glyph that leads to how projects are run", async () => {
        const wrapper = await open("huella-legal");

        expect(wrapper.get("a").attributes("href")).toBe("/agentic-workflows");
        expect(wrapper.findAll("[data-map-plate] rect[data-tone]")).toHaveLength(2);
    });

    it("draws no glyph while that plan is missing, rather than another project's", async () => {
        const wrapper = await open("blog");

        expect(wrapper.find("[data-workflow-glyph]").exists()).toBe(false);
    });
});
