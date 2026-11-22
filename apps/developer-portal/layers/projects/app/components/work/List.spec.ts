import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
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

describe("WorkList", () => {
    it("leads with the first case's screenshot and shows no other", async () => {
        const wrapper = await mountSuspended(WorkList);

        expect(wrapper.findAll("img")).toHaveLength(1);
        expect(wrapper.get("img").attributes("src")).toBeTruthy();
    });

    it("links each case to its study and each tool to where it can be seen", async () => {
        const wrapper = await mountSuspended(WorkList);

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toEqual(
            expect.arrayContaining([
                "/work/huella-legal",
                "/work/marina-roustan",
                "/wiki/apps/wp-editor/readme",
            ]),
        );
        expect(links).not.toContain("/work/wp-editor");
    });
});
