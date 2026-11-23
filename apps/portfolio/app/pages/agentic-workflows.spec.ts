import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import type { ProjectMap } from "~/types/ProjectMap";
import type { SiteData } from "~/types/SiteData";
import Page from "./agentic-workflows.vue";

const DATA_URL = "https://portal.test/embed/data.json";

const MAP = {
    stages: [],
    nodes: [],
    edges: [],
    width: 0,
    height: 0,
    nodeWidth: 164,
    nodeHeight: 30,
    blocks: { done: 0, moving: 1, total: 1 },
    tickets: null,
} satisfies ProjectMap;

const DATA = {
    benchmarks: [],
    decisions: [],
    workflows: {
        projects: ["blog", "shop"].map((id) => ({ id, title: id, map: MAP, glyph: MAP })),
        templates: [],
        lessons: 0,
    },
    rules: null,
    specs: null,
} satisfies SiteData;

afterEach(() => {
    useRuntimeConfig().public.dataUrl = "";
});

describe("agentic workflows page", () => {
    it("links every project the portal maps to its page on the developer portal", async () => {
        useRuntimeConfig().public.dataUrl = DATA_URL;
        serveEndpoint(DATA_URL, () => DATA);
        const wrapper = await mountSuspended(Page);
        await flushPromises();

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toEqual(
            expect.arrayContaining(["/workflows/blog", "/workflows/shop"].map(portalUrl)),
        );
    });
});
