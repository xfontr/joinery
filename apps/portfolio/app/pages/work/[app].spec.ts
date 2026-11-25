import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Page from "./[app].vue";

const setStatus = vi.hoisted(() => vi.fn());
mockNuxtImport("setResponseStatus", () => setStatus);

const HUELLA = {
    path: "/work/huella-legal",
    name: "Huella Legal",
    title: "Huella",
    mark: "Legal",
    kind: "Law magazine",
    stage: "On staging",
    line: "A law magazine.",
    caseStudy: true,
    why: "Why it exists.",
    facts: ["105 articles"],
    countedOn: "29 Sep 2026",
    design: [{ label: "Paper", value: "Ivory" }],
    screenshot: { file: "huella-legal.jpg", alt: "The new home page", caption: "On staging." },
    live: { href: "https://staging.example.com", label: "See the new site" },
    decisions: [
        { id: "0028-urls", question: "Will links work?", answer: "Yes." },
        { id: "0030-hosting", question: "Where is it hosted?", answer: "Somewhere." },
    ],
};

const MARINA = {
    ...HUELLA,
    path: "/work/marina-roustan",
    name: "Marina Roustan",
};

const TOOL = {
    path: "/work/wp-editor",
    name: "WP Editor",
    kind: "Editing tool",
    stage: "In use",
    line: "A tool.",
    caseStudy: false,
    live: { href: "/wiki/apps/wp-editor/readme", label: "Read the docs" },
};

mockNuxtImport("queryCollection", () => () => ({
    path: (path: string) => ({
        first: () =>
            Promise.resolve([HUELLA, MARINA, TOOL].find((row) => row.path === path) ?? null),
    }),
}));

beforeEach(() => {
    setStatus.mockClear();
});

describe("/work/<app>", () => {
    it("renders a case's screenshot, live link and decisions from its entry", async () => {
        const wrapper = await mountSuspended(Page, { route: "/work/huella-legal" });

        const image = wrapper.get("img");
        expect(image.attributes("srcset")).toMatch(/ 480w, .+ 960w, .+ 1440w$/);
        expect(image.attributes("alt")).toBe(HUELLA.screenshot.alt);
        expect(wrapper.find(`a[href="${HUELLA.live.href}"]`).exists()).toBe(true);
        for (const decision of HUELLA.decisions) {
            expect(
                wrapper.find(`a[href="${portalUrl(`/decisions/${decision.id}`)}"]`).exists(),
            ).toBe(true);
        }
        expect(setStatus).not.toHaveBeenCalled();
    });

    it("answers an unknown app with a 404 instead of an empty case page", async () => {
        const wrapper = await mountSuspended(Page, { route: "/work/not-an-app" });

        expect(setStatus).toHaveBeenCalledWith(404);
        expect(wrapper.find("img").exists()).toBe(false);
    });

    it("answers a tool with a 404, since it has no study to show", async () => {
        const wrapper = await mountSuspended(Page, { route: "/work/wp-editor" });

        expect(setStatus).toHaveBeenCalledWith(404);
        expect(wrapper.find("img").exists()).toBe(false);
    });
});
