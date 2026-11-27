import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { SiteData } from "~/types/SiteData";
import Page from "./index.vue";

const WORK = [
    {
        path: "/work/huella-legal",
        name: "Huella Legal",
        title: "Huella",
        mark: "Legal",
        kind: "Law magazine",
        stage: "Redesign on staging",
        line: "A law magazine.",
        caseStudy: true,
        live: { href: "https://staging.example.com", label: "See the new site" },
    },
    {
        path: "/work/portal",
        name: "This portal",
        kind: "Developer portal",
        stage: "Mid-redesign",
        line: "The site you're reading.",
        caseStudy: false,
        live: { href: "/", label: "Open the developer view" },
    },
];

mockNuxtImport("queryCollection", () => () => {
    const query = {
        where: () => query,
        select: () => query,
        order: () => query,
        all: () => Promise.resolve(WORK),
    };
    return query;
});

const DATA_URL = "https://portal.test/embed/data.json";

const EMPTY = {
    benchmarks: [],
    decisions: [],
    workflows: { projects: [], templates: [], lessons: 0 },
    rules: null,
    specs: null,
} satisfies SiteData;

const open = async (data: Partial<SiteData> = {}) => {
    serveEndpoint(DATA_URL, () => ({ ...EMPTY, ...data }) satisfies SiteData);
    const wrapper = await mountSuspended(Page);
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    useRuntimeConfig().public.dataUrl = DATA_URL;
});

afterEach(() => {
    useRuntimeConfig().public.dataUrl = "";
});

describe("front page", () => {
    it("states every proof without a number when nothing was ever collected", async () => {
        const wrapper = await open();

        expect(wrapper.findAll("[data-rule]")).toHaveLength(5);
        expect(wrapper.text()).toContain("index.rules.look.proof");
        expect(wrapper.text()).toContain("index.rules.prove.proof");
    });

    it("sends the reader who wants everything to the developer portal", async () => {
        const wrapper = await open();

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toContain(portalUrl("/"));
        expect(links).not.toContain("/");
    });
});
