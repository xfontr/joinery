import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import WidgetPanel from "./WidgetPanel.vue";

describe("WidgetPanel", () => {
    it("links its title to the page the whole dataset lives on", async () => {
        const wrapper = await mountSuspended(WidgetPanel, {
            props: { title: "Coverage", to: "/coverage" },
        });

        expect(wrapper.find("h2 a").attributes("href")).toBe("/coverage");
    });

    it("shows a count of zero, which is a count and not a missing one", async () => {
        const wrapper = await mountSuspended(WidgetPanel, {
            props: { title: "Outdated", count: 0 },
        });

        expect(wrapper.find("[data-figure]").text()).toBe("0");
    });

    it("adds a footer link only when given one", async () => {
        const plain = await mountSuspended(WidgetPanel, { props: { title: "Plain" } });
        expect(plain.find("a").exists()).toBe(false);

        const linked = await mountSuspended(WidgetPanel, {
            props: { title: "Workflows", all: { label: "New workflow", to: "/workflows/new" } },
        });
        expect(linked.find("a[href='/workflows/new']").exists()).toBe(true);
    });

    it("reports the filter tab picked", async () => {
        const wrapper = await mountSuspended(WidgetPanel, {
            props: {
                title: "Runs",
                filter: "chart",
                filters: [
                    { value: "chart", label: "Chart" },
                    { value: "table", label: "Table" },
                ],
            },
        });

        await wrapper.findAll("[role='tab']")[1]?.trigger("mousedown", { button: 0 });

        expect(wrapper.emitted("update:filter")).toEqual([["table"]]);
    });
});
