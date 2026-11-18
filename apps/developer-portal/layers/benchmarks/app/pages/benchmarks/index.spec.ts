import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Page from "./index.vue";

// An in-memory docs collection holding the benchmark folder
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
