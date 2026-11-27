import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import WidgetPanel from "./WidgetPanel.vue";

describe("WidgetPanel", () => {
    it("shows a count of zero, which is a count and not a missing one", async () => {
        const wrapper = await mountSuspended(WidgetPanel, {
            props: { title: "Outdated", count: 0 },
        });

        expect(wrapper.find("[data-figure]").text()).toBe("0");
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
