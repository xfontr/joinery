import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import ListCard from "./ListCard.vue";

const PROPS = { title: "Every audit", note: "" };

describe("ListCard", () => {
    it("counts the rows the filter lets through out of all of them", async () => {
        const wrapper = await mountSuspended(ListCard, {
            props: { ...PROPS, shown: 2, total: 5 },
            slots: { default: () => "Rows placeholder" },
        });

        expect(wrapper.text()).toContain("2 of 5");
        expect(wrapper.text()).toContain("Rows placeholder");
    });

    it("swaps the rows for the empty line once the filter lets none through", async () => {
        const wrapper = await mountSuspended(ListCard, {
            props: { ...PROPS, shown: 0, total: 5 },
            slots: { default: () => "Rows placeholder", empty: () => "Empty placeholder" },
        });

        expect(wrapper.text()).toContain("Empty placeholder");
        expect(wrapper.text()).not.toContain("Rows placeholder");
    });
});
