import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
    const { $i18n } = useNuxtApp();
    $i18n.mergeLocaleMessage($i18n.locale.value, {
        index: {
            rules: {
                look: { proofCount: "{count} studied" },
                prove: { proofCount: "{enabled} rules, {inHouse} ours" },
            },
        },
    });
});

afterEach(() => {
    vi.unstubAllGlobals();
    useRuntimeConfig().public.dataUrl = "";
});

describe("front page", () => {
    it("states every proof without a number when nothing was ever collected", async () => {
        const wrapper = await open();

        expect(wrapper.findAll("article")).toHaveLength(5 + WORK.length);
        expect(wrapper.text()).toContain("index.rules.look.proof");
        expect(wrapper.text()).toContain("index.rules.prove.proof");
        expect(wrapper.find("[data-workflow-glyph]").exists()).toBe(false);
    });

    it("words the portal's lint rule counts", async () => {
        const wrapper = await open({ rules: { enabled: 2, inHouse: 1 } });

        expect(wrapper.text()).toContain("2 rules, 1 ours");
    });

    it("counts the benchmarked sites the portal lists", async () => {
        const wrapper = await open({
            benchmarks: [
                { id: "rauno-me", title: "rauno.me", screenshot: "/a.webp" },
                { id: "primer-style", title: "primer.style", screenshot: "/b.webp" },
            ],
        });

        expect(wrapper.text()).toContain("2 studied");
    });

    it("sends the reader who wants everything to the developer portal", async () => {
        const wrapper = await open();

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toContain(portalUrl("/"));
        expect(links).not.toContain("/");
    });

    it("shows the benchmark screenshots from the portal that serves them", async () => {
        vi.stubGlobal("matchMedia", (query: string) => ({
            matches: true,
            media: query,
            addEventListener: () => {},
            removeEventListener: () => {},
        }));
        const wrapper = await open({
            benchmarks: [{ id: "rauno-me", title: "rauno.me", screenshot: "/shots/rauno-me.webp" }],
        });

        await wrapper.find("article").trigger("pointerenter", { pointerType: "mouse" });

        expect(wrapper.get("[data-cursor-preview] img").attributes("src")).toBe(
            "https://portal.test/shots/rauno-me.webp",
        );
    });

    it.each([
        { pointerType: "mouse", previewed: true },
        { pointerType: "touch", previewed: false },
    ])("previews a rule under a $pointerType: $previewed", async ({ pointerType, previewed }) => {
        vi.stubGlobal("matchMedia", (query: string) => ({
            matches: true,
            media: query,
            addEventListener: () => {},
            removeEventListener: () => {},
        }));
        const wrapper = await open();

        await wrapper.find("article").trigger("pointerenter", { pointerType });

        expect(wrapper.find("[data-cursor-preview]").exists()).toBe(previewed);
    });
});
