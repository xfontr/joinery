import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import TelemetryDaily from "./TelemetryDaily.vue";

const USAGE = {
    generatedAt: "2026-11-10T00:00:00Z",
    windowDays: 90,
    known: ["lint"],
    scripts: {
        lint: {
            runs: 6,
            recent: 6,
            failures: 2,
            headless: 4,
            totalMs: 0,
            first: "2026-11-08",
            last: "2026-11-09",
            callers: {},
            commands: {},
            targets: {},
            areas: {},
            flags: {},
            days: {
                "2026-11-08": { runs: 2, agent: 1, failures: 0 },
                "2026-11-09": { runs: 4, agent: 3, failures: 2 },
            },
        },
    },
    lint: { since: null, rules: {} },
} satisfies UsageArtifact;

describe("TelemetryDaily", () => {
    it("charts the series picked in the page's facts", async () => {
        const wrapper = await mountSuspended(TelemetryDaily, {
            props: { usage: USAGE, series: "failures" },
        });

        const values: number[] = wrapper.findComponent({ name: "DailyChart" }).props("values");
        expect(values.reduce((sum, value) => sum + value, 0)).toBe(2);
    });

    it("falls back to all runs for a series it doesn't know", async () => {
        const wrapper = await mountSuspended(TelemetryDaily, {
            props: { usage: USAGE, series: "" },
        });

        const values: number[] = wrapper.findComponent({ name: "DailyChart" }).props("values");
        expect(values.reduce((sum, value) => sum + value, 0)).toBe(6);
    });

    it("names the busiest day in the reading under the chart", async () => {
        const wrapper = await mountSuspended(TelemetryDaily, {
            props: { usage: USAGE, series: "runs" },
        });

        expect(wrapper.text()).toContain("9 Nov, with 4");
    });
});
