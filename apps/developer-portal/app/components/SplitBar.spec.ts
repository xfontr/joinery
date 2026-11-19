import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import SplitBar from "./SplitBar.vue";

const widths = (wrapper: VueWrapper) =>
    wrapper.findAll("[role='img'] span").map((part) => part.attributes("style"));

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

    it("names every part with its count for a screen reader, the empty ones included", async () => {
        const wrapper = await mountSuspended(SplitBar, {
            props: {
                parts: [
                    { label: "done", value: 3 },
                    { label: "skipped", value: 0 },
                ],
            },
        });

        expect(wrapper.find("[role='img']").attributes("aria-label")).toBe("3 done, 0 skipped");
    });
});
