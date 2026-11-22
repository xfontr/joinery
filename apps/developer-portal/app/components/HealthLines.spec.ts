import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { HealthLine } from "~/types/HealthLine";
import HealthLines from "./HealthLines.vue";

const LINES: HealthLine[] = [
    {
        label: "Line coverage",
        value: "42%",
        tone: "bad",
        to: "/coverage",
        legend: false,
        parts: [{ label: "covered", value: 42 }],
    },
    {
        label: "Doc pages",
        value: "10",
        tone: "neutral",
        to: "/wiki",
        legend: false,
        parts: [],
        note: "2 broken links",
    },
];

describe("HealthLines", () => {
    it("prints a figure in its tone, and a neutral one in the plain highlight", async () => {
        const wrapper = await mountSuspended(HealthLines, {
            props: { lines: LINES, collectedAge: "1 day ago" },
        });

        const figures = wrapper.findAll("dd[data-figure]");
        expect(figures[0]?.classes()).toContain("tone-bad");
        expect(figures[1]?.classes()).toContain("text-highlighted");
    });

    it("draws a bar only for a line with parts, and its note when it has one", async () => {
        const wrapper = await mountSuspended(HealthLines, {
            props: { lines: LINES, collectedAge: "1 day ago" },
        });

        expect(wrapper.findAllComponents({ name: "SplitBar" })).toHaveLength(1);
        expect(wrapper.text()).toContain("2 broken links");
    });
});
