import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BenchmarkPage } from "#layers/benchmarks/app/utils/benchmarks.ts";
import Page from "./[id].vue";

// An in-memory docs collection, answering both the gallery list and the page's own lookup
const docs = vi.hoisted(() => ({ pages: [] as BenchmarkPage[] }));

mockNuxtImport("queryCollection", () => () => {
    const query = {
        where: () => query,
        select: () => query,
        all: () => Promise.resolve(docs.pages),
        path: (path: string) => ({
            first: () => Promise.resolve(docs.pages.find((page) => page.path === path) ?? null),
        }),
    };
    return query;
});

// Only a server render can set a status; the prerender crawler is what reads it
const setStatus = vi.hoisted(() => vi.fn());
mockNuxtImport("setResponseStatus", () => setStatus);

const global = {
    stubs: {
        ContentRenderer: { props: { value: Object }, template: "<div>{{ value?.title }}</div>" },
    },
};

beforeEach(() => {
    setStatus.mockClear();
    clearNuxtData();
    docs.pages = [
        {
            path: "/docs/benchmarks/super-eight",
            title: "🔖 Super Eight",
            kind: "design-studio",
            verdict: "partial",
            url: "https://example.com/super-eight",
        },
        {
            path: "/docs/benchmarks/rauno-me",
            title: "🔖 rauno.me",
            kind: "portfolio",
            verdict: "strong",
        },
        {
            path: "/docs/benchmarks/plain-site",
            title: "🔖 Plain site",
            kind: "portfolio",
            verdict: "avoid",
        },
    ];
});

const neighbours = (wrapper: VueWrapper) =>
    wrapper
        .findAll("a[href^='/benchmarks/']")
        .map((link) => link.attributes("href"))
        .filter((href) => href !== "/benchmarks/");

describe("benchmark page", () => {
    it("links to the entries either side of it in the gallery's strongest-first order", async () => {
        const wrapper = await mountSuspended(Page, { global, route: "/benchmarks/super-eight" });

        expect(neighbours(wrapper)).toEqual(["/benchmarks/rauno-me", "/benchmarks/plain-site"]);
    });

    it("offers no previous entry on the first page of the gallery", async () => {
        const wrapper = await mountSuspended(Page, { global, route: "/benchmarks/rauno-me" });

        expect(neighbours(wrapper)).toEqual(["/benchmarks/super-eight"]);
    });

    it("shows the verdict, the kind spelled out and a link to the live site", async () => {
        const wrapper = await mountSuspended(Page, { global, route: "/benchmarks/super-eight" });

        expect(wrapper.findComponent({ name: "StatusPill" }).props("label")).toBe(
            benchmarkVerdictLabel("partial"),
        );
        expect(wrapper.text()).toContain("design studio");
        expect(wrapper.find("a[href='https://example.com/super-eight']").exists()).toBe(true);
    });

    it("answers 404 with no neighbours for a site that is not in the library", async () => {
        const wrapper = await mountSuspended(Page, { global, route: "/benchmarks/missing" });

        expect(setStatus).toHaveBeenCalledWith(404);
        expect(neighbours(wrapper)).toEqual([]);
        expect(wrapper.text()).toContain("missing");
    });
});
