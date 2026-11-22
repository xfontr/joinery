import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import Page from "./index.vue";

const row = (slug: string, caseStudy: boolean) => ({
    path: `/work/${slug}`,
    name: slug,
    title: slug,
    mark: "Mark",
    kind: "Kind",
    stage: "Stage",
    line: "Line.",
    caseStudy,
    facts: ["1 fact"],
    screenshot: { file: `${slug}.jpg`, alt: slug, caption: "Caption." },
    live: { href: "https://example.com", label: "Live" },
});

const ROWS = [row("huella-legal", true), row("marina-roustan", true), row("wp-editor", false)];

mockNuxtImport("queryCollection", () => () => {
    const query = {
        select: () => query,
        order: () => query,
        all: () => Promise.resolve(ROWS),
    };
    return query;
});

describe("/work", () => {
    it("links every case study to its own page and leaves out a tool", async () => {
        const wrapper = await mountSuspended(Page, { route: "/work" });

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toEqual(["/work/huella-legal", "/work/marina-roustan"]);
    });

    it("shows each case's screenshot, so none renders as a broken image", async () => {
        const wrapper = await mountSuspended(Page, { route: "/work" });

        const sources = wrapper.findAll("img").map((image) => image.attributes("src"));
        expect(sources).toHaveLength(2);
        expect(sources.every(Boolean)).toBe(true);
    });
});
