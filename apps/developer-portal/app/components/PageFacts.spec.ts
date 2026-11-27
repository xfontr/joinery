import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import PageFacts from "./PageFacts.vue";

const FACTS = [
    { label: "Runs", value: "20", series: "runs" },
    { label: "Failed", value: "25%", series: "failures" },
    { label: "Scripts", value: "4" },
];

describe("PageFacts", () => {
    it("makes only a fact that drives the chart a button, pressed while it is the one drawn", async () => {
        const wrapper = await mountSuspended(PageFacts, {
            props: { facts: FACTS, series: "runs" },
        });

        expect(
            wrapper.findAll("button").map((button) => button.attributes("aria-pressed")),
        ).toEqual(["true", "false"]);
    });

    it("reports the series picked", async () => {
        const wrapper = await mountSuspended(PageFacts, {
            props: { facts: FACTS, series: "runs" },
        });

        await wrapper.findAll("button")[1]?.trigger("click");

        expect(wrapper.emitted("update:series")).toEqual([["failures"]]);
    });

    it("leaves out the list when there are no facts", async () => {
        const wrapper = await mountSuspended(PageFacts, {
            props: { facts: [] },
        });

        expect(wrapper.find("dl").exists()).toBe(false);
    });
});
