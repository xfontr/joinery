import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import SplitBar from "./SplitBar.vue";

const widths = (wrapper: VueWrapper) =>
    wrapper.findAll("[aria-hidden='true'] span").map((part) => part.attributes("style"));

describe("SplitBar", () => {
    it("sizes each part by its share of the total and leaves an empty part out", async () => {
        const wrapper = await mountSuspended(SplitBar, {
            props: {
                parts: [
                    { label: "done", value: 3 },
                    { label: "skipped", value: 0 },
                    { label: "to go", value: 1 },
                ],
            },
        });

        expect(widths(wrapper)).toEqual(["width: 75%;", "width: 25%;"]);
    });

    it("names every part with its count for a screen reader when no legend shows them", async () => {
        const wrapper = await mountSuspended(SplitBar, {
            props: {
                legend: false,
                parts: [
                    { label: "done", value: 3 },
                    { label: "skipped", value: 0 },
                ],
            },
        });

        expect(wrapper.find(".sr-only").text()).toBe("3 done, 0 skipped");
    });

    it("leaves the counts to the legend instead of announcing them twice", async () => {
        const wrapper = await mountSuspended(SplitBar, {
            props: { parts: [{ label: "done", value: 3 }] },
        });

        expect(wrapper.find(".sr-only").exists()).toBe(false);
        expect(wrapper.find("p").text()).toBe("3 done");
    });
});
