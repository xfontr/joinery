import { mountSuspended } from "@nuxt/test-utils/runtime";
import { type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it } from "vitest";
import DailyChart from "./DailyChart.vue";

const DAYS = ["2026-11-05", "2026-11-06", "2026-11-07"];

const mount = (values: number[]) =>
    mountSuspended(DailyChart, {
        props: { days: DAYS, values, unit: "runs", endLabel: "last day" },
    });

const axis = (wrapper: VueWrapper) =>
    wrapper.findAll("[aria-hidden='true'] > span").map((label) => label.text());

const bars = (wrapper: VueWrapper) => wrapper.findAll("[style*='height']");

const heights = (wrapper: VueWrapper) => bars(wrapper).map((bar) => bar.attributes("style"));

// The hover is caught by each bar's column and released by the plot around every column
const hover = async (wrapper: VueWrapper, index: number, event: "mouseenter" | "mouseleave") => {
    const column = bars(wrapper)[index]!.element.parentElement!;
    const target = event === "mouseenter" ? column : column.parentElement!.parentElement!;
    target.dispatchEvent(new MouseEvent(event));
    await nextTick();
};

describe("DailyChart", () => {
    it("rounds the axis up to an even step so the midline reads as a whole number", async () => {
        const wrapper = await mount([3, 7, 1]);

        expect(axis(wrapper)).toEqual(["8", "4", "0"]);
    });

    it("rounds a larger axis to a fifth of its magnitude", async () => {
        const wrapper = await mount([10, 37, 12]);

        expect(axis(wrapper)).toEqual(["40", "20", "0"]);
    });

    it("sizes each bar against the axis top, not against the busiest day", async () => {
        const wrapper = await mount([2, 6, 8]);

        expect(heights(wrapper)).toEqual(["height: 25%;", "height: 75%;", "height: 100%;"]);
    });

    it("shows a day's own count when its bar is hovered, and hides it on leaving", async () => {
        const wrapper = await mount([3, 7, 1]);

        await hover(wrapper, 1, "mouseenter");
        const [day, count] = wrapper.findAll("output > span").map((line) => line.text());
        expect([day, count]).toEqual([calendarDay("2026-11-06"), "7 runs"]);

        await hover(wrapper, 1, "mouseleave");
        expect(wrapper.find("output").exists()).toBe(false);
    });
});
