import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { ProjectTab } from "~/types/ProjectTab";
import type { ProjectTabRow } from "~/types/ProjectTabRow";
import ExtraTab from "./ExtraTab.vue";

const TAB = {
    label: "Workflows",
    rows: "/api/workflows/areas",
    to: "/workflows",
    empty: "No workflow builds this project.",
} satisfies ProjectTab;

const ROW = {
    id: "blog",
    title: "Blog rebuild",
    to: "/workflows/blog",
    percent: 40,
    done: 4,
    left: 6,
} satisfies ProjectTabRow;

describe("ProjectExtraTab", () => {
    it("links each row to its own page with its percentage", async () => {
        const wrapper = await mountSuspended(ExtraTab, {
            props: { tab: { ...TAB, items: [ROW] }, name: "ui" },
        });

        const link = wrapper.find("li a");
        expect(link.attributes("href")).toBe("/workflows/blog");
        expect(link.text()).toMatch(/Blog rebuild\s*40\s*%/);
    });

    it("shows the tab's own empty line when no row belongs to the project", async () => {
        const wrapper = await mountSuspended(ExtraTab, {
            props: { tab: { ...TAB, empty: "Nothing here: placeholder", items: [] }, name: "ui" },
        });

        expect(wrapper.text()).toContain("Nothing here: placeholder");
        expect(wrapper.find("ul").exists()).toBe(false);
    });
});
