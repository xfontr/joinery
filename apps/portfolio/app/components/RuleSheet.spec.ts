import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectMap } from "~/types/ProjectMap";
import type { RuleId } from "~/types/RuleId";
import type { SiteData } from "~/types/SiteData";
import RuleSheet from "./RuleSheet.vue";

const DATA_URL = "https://portal.test/embed/data.json";

const MAP = {
    stages: [],
    nodes: [
        { id: "audit", title: "Audit", label: "Audit", tone: "done", owner: false, x: 0, y: 0 },
    ],
    edges: [],
    width: 10,
    height: 10,
    nodeWidth: 10,
    nodeHeight: 10,
    blocks: { done: 1, moving: 0, total: 1 },
    tickets: null,
} satisfies ProjectMap;

const FULL = {
    benchmarks: ["a", "b", "c", "d"].map((id) => ({ id, title: id, screenshot: `/${id}.webp` })),
    decisions: [
        {
            id: "0028-huella-legal-urls-and-cutover",
            number: "0028",
            title: "URLs and cutover",
            status: "implemented",
        },
    ],
    workflows: {
        projects: [{ id: "huella-legal", title: "Huella Legal", map: MAP }],
        templates: [],
        lessons: 0,
    },
    rules: { enabled: 3, inHouse: 1 },
    specs: 42,
} satisfies SiteData;

const EMPTY = {
    benchmarks: [],
    decisions: [],
    workflows: { projects: [], templates: [], lessons: 0 },
    rules: null,
    specs: null,
} satisfies SiteData;

const open = async (data: SiteData) => {
    serveEndpoint(DATA_URL, () => data);
    const wrapper = await mountSuspended(RuleSheet);
    await flushPromises();
    return wrapper;
};

const hover = async (wrapper: Awaited<ReturnType<typeof open>>, id: RuleId) => {
    await wrapper.get(`[data-rule="${id}"]`).trigger("pointerenter", { pointerType: "mouse" });
    return wrapper.find("[data-cursor-preview]");
};

beforeEach(() => {
    useRuntimeConfig().public.dataUrl = DATA_URL;
    vi.stubGlobal("matchMedia", (query: string) => ({
        matches: true,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
    }));
});

afterEach(() => {
    vi.unstubAllGlobals();
    useRuntimeConfig().public.dataUrl = "";
});

describe("RuleSheet", () => {
    it("fans out at most three benchmark screenshots, however many the portal lists", async () => {
        const preview = await hover(await open(FULL), "look");

        expect(preview.findAll("img")).toHaveLength(3);
    });

    it("previews the decision report the rule names, with its status", async () => {
        const preview = await hover(await open(FULL), "decide");

        expect(preview.text()).toContain("URLs and cutover");
        expect(preview.text()).toContain("decisions.status.implemented");
    });

    it("draws Huella Legal's plan under the planning rule", async () => {
        const preview = await hover(await open(FULL), "plan");

        expect(preview.find("[data-workflow-glyph]").exists()).toBe(true);
    });

    it("walks the agent pipeline under the agents rule", async () => {
        const preview = await hover(await open(FULL), "agents");

        expect(preview.findAll("[data-pipeline-step]").length).toBeGreaterThan(0);
    });

    it.each([
        { data: FULL, figures: ["checksPreview.tests.count", "checksPreview.lint.count"] },
        { data: EMPTY, figures: ["checksPreview.tests.none", "checksPreview.lint.none"] },
    ])("words each check's figure, or its absence: $figures", async ({ data, figures }) => {
        const preview = await hover(await open(data), "prove");

        for (const figure of figures) expect(preview.text()).toContain(figure);
    });

    it.each(["decide", "plan"] as const)(
        "shows no %s card when the portal sent nothing to put on it",
        async (id) => {
            const preview = await hover(await open(EMPTY), id);

            expect(preview.text()).toBe("");
        },
    );

    it("closes the preview once the pointer leaves the rule", async () => {
        const wrapper = await open(FULL);
        await hover(wrapper, "look");

        await wrapper.get('[data-rule="look"]').trigger("pointerleave");

        expect(wrapper.find("[data-cursor-preview]").exists()).toBe(false);
    });

    it("starts fetching the first three screenshots when the pointer first enters the sheet", async () => {
        const fetched: string[] = [];
        vi.stubGlobal(
            "Image",
            class {
                set src(value: string) {
                    fetched.push(value);
                }
                decode = () => Promise.reject(new Error("offline"));
            },
        );
        const wrapper = await open(FULL);

        await wrapper.get("section").trigger("pointerenter");
        await wrapper.get("section").trigger("pointerenter");

        expect(fetched).toEqual(["/a.webp", "/b.webp", "/c.webp"].map((path) => portalUrl(path)));
    });
});
