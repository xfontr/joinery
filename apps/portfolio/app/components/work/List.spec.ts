import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import WorkList from "./List.vue";

const ROWS = [
    {
        path: "/work/huella-legal",
        name: "Huella Legal",
        title: "Huella",
        mark: "Legal",
        facts: ["105 articles"],
        kind: "Law magazine",
        stage: "On staging",
        line: "A law magazine.",
        caseStudy: true,
        screenshot: { file: "huella-legal.jpg", alt: "Home", caption: "Home." },
        live: { href: "https://staging.example.com", label: "See the new site" },
    },
    {
        path: "/work/marina-roustan",
        name: "Marina Roustan",
        title: "Marina",
        mark: "Roustan",
        facts: ["10 posts"],
        kind: "Practice",
        stage: "In design",
        line: "A practice.",
        caseStudy: true,
        screenshot: { file: "marina-roustan.jpg", alt: "Home", caption: "Home." },
        live: { href: "https://example.com", label: "See today's site" },
    },
    {
        path: "/work/wp-editor",
        name: "WP Editor",
        kind: "Editing tool",
        stage: "In use",
        line: "A tool.",
        caseStudy: false,
        live: { href: "/wiki/apps/wp-editor/readme", label: "Read the docs" },
    },
];

mockNuxtImport("queryCollection", () => () => {
    const query = {
        select: () => query,
        order: () => query,
        all: () => Promise.resolve(ROWS),
    };
    return query;
});

const observers: { callback: IntersectionObserverCallback }[] = [];

class FakeObserver {
    observe = vi.fn();
    disconnect = vi.fn();

    constructor(public callback: IntersectionObserverCallback) {
        observers.push(this);
    }
}

const cross = async (wrapper: VueWrapper, slug: string, isIntersecting: boolean) => {
    const target = wrapper.get(`[data-slug="${slug}"]`).element;
    observers
        .at(-1)!
        .callback(
            [{ target, isIntersecting }] as unknown as IntersectionObserverEntry[],
            {} as IntersectionObserver,
        );
    await nextTick();
};

const lit = (wrapper: VueWrapper) =>
    wrapper.findAll("[data-lit]").map((row) => row.attributes("data-slug"));

beforeEach(() => {
    observers.length = 0;
    vi.stubGlobal("IntersectionObserver", FakeObserver);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("WorkList", () => {
    it("shows a screenshot beside each entry that names one, and none beside one that doesn't", async () => {
        const wrapper = await mountSuspended(WorkList);

        const images = wrapper.findAll("img");
        expect(images).toHaveLength(2);
        for (const image of images) expect(image.attributes("src")).toBeTruthy();
    });

    it("links each case to its study and each tool to where it can be seen", async () => {
        const wrapper = await mountSuspended(WorkList);

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toEqual(
            expect.arrayContaining([
                "/work/huella-legal",
                "/work/marina-roustan",
                portalUrl("/wiki/apps/wp-editor/readme"),
            ]),
        );
        expect(links).not.toContain("/work/wp-editor");
    });

    it("dims nothing until the reader scrolls, even with a row already mid-screen", async () => {
        const wrapper = await mountSuspended(WorkList);

        await cross(wrapper, "huella-legal", true);

        expect(lit(wrapper)).toEqual([]);
    });

    it("lights the row crossing the middle once the reader scrolls, and only that one", async () => {
        const wrapper = await mountSuspended(WorkList);
        window.dispatchEvent(new Event("scroll"));

        await cross(wrapper, "huella-legal", true);
        await cross(wrapper, "marina-roustan", true);
        await cross(wrapper, "huella-legal", false);

        expect(lit(wrapper)).toEqual(["marina-roustan"]);
    });
});
