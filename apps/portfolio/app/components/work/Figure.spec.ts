import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { WorkCase } from "~/types/WorkCase";
import Figure from "./Figure.vue";

const WORK_ITEM: WorkCase = {
    slug: "huella-legal",
    name: "Huella Legal",
    title: "Huella",
    mark: "Legal",
    kind: "Law magazine",
    stage: "Redesign on staging",
    line: "A law magazine.",
    caseStudy: true,
    why: "Why.",
    facts: [],
    countedOn: "29 Sep 2026",
    inProgress: false,
    design: [],
    decisions: [],
    screenshot: { file: "huella-legal.jpg", alt: "The new home page", caption: "On staging." },
    live: { href: "https://staging.example.com", label: "See the new site" },
};

describe("WorkFigure", () => {
    it("shows the work's screenshot with its alt text and links to the live site", async () => {
        const wrapper = await mountSuspended(Figure, { props: { work: WORK_ITEM } });

        const image = wrapper.find("img");
        expect(image.attributes("src")).toBeTruthy();
        expect(image.attributes("alt")).toBe(WORK_ITEM.screenshot.alt);
        expect(wrapper.find("a").attributes("href")).toBe(WORK_ITEM.live.href);
    });
});
