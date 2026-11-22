import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Page from "./index.vue";

const MESSAGES = {
    app: {
        apps: {
            catalog: "Catalog",
            docs: "Docs",
            health: "Health",
            home: "Home",
            work: "Work",
        },
        nav: {
            audits: "Audits",
            benchmarks: "Benchmarks",
            changelog: "What's new",
            coverage: "Coverage",
            decisions: "Decisions",
            deps: "Dependencies",
            docs: "Documentation",
            graph: "Architecture",
            issues: "Work in progress",
            overview: "Overview",
            projects: "Projects",
            telemetry: "Tooling usage",
            workflows: "Workflows",
        },
    },
    benchmarks: {
        empty: {
            each: "one file per site",
        },
        guide: "How an entry is written",
        intro: "Sites reviewed as design references, kept so the next redesign starts from what has already been studied. Each entry is a verdict, a screenshot and a short critique; what a project takes from them lives in its own decision report.",
        title: "Benchmarks",
        verdict: {
            avoid: "Avoid",
            partial: "Take one thing",
            strong: "Strong reference",
        },
    },
    benchmarksCard: {
        screenshot: "{title}, first screen",
    },
    benchmarksFacts: {
        provenance: "Read from docs/benchmarks/",
        sites: "Sites",
    },
    benchmarksToolbar: {
        everyKind: "Every kind",
        everyVerdict: "Every verdict",
        search: "Search site or verdict…",
    },
    collectionEmpty: {
        nothing: "Nothing under {folder} yet.",
        writes: "The {skill} skill writes {each}{collect}.",
    },
    pageHeader: {
        wordmark: "monorepo",
    },
};

const docs = vi.hoisted(() => ({ pages: [] as Record<string, string>[] }));

mockNuxtImport("queryCollection", () => () => {
    const query = {
        where: () => query,
        select: () => query,
        all: () => Promise.resolve(docs.pages),
    };
    return query;
});

beforeEach(() => {
    clearNuxtData("benchmarks");
    docs.pages = [
        { path: "/docs/benchmarks/readme", title: "🔖 Benchmarks" },
        {
            path: "/docs/benchmarks/rauno-me",
            title: "🔖 rauno.me",
            kind: "portfolio",
            verdict: "strong",
            description: "One sentence.",
        },
        {
            path: "/docs/benchmarks/super-eight",
            title: "🔖 Super Eight",
            kind: "studio",
            verdict: "partial",
            description: "One headline.",
        },
    ];
});

const cards = (wrapper: VueWrapper) =>
    wrapper.findAll("a[href^='/benchmarks/']").map((card) => card.attributes("href"));

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("benchmarks index", () => {
    it("shows one card per site, strongest first, each linking to its page", async () => {
        const wrapper = await mountSuspended(Page);

        expect(cards(wrapper)).toEqual(["/benchmarks/rauno-me", "/benchmarks/super-eight"]);
    });

    it("shows each site's screenshot from where the build serves the folder's images", async () => {
        const wrapper = await mountSuspended(Page);

        expect(wrapper.find("img").attributes("src")).toBe(
            "/doc-assets/docs/benchmarks/images/rauno-me.webp",
        );
    });

    it("says the library is empty instead of rendering an empty grid", async () => {
        docs.pages = [];
        const wrapper = await mountSuspended(Page);

        expect(cards(wrapper)).toEqual([]);
        expect(wrapper.text()).toContain("docs/benchmarks/");
    });
});
