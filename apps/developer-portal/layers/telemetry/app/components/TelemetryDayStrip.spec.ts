import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TelemetryDayStrip from "./TelemetryDayStrip.vue";

describe("TelemetryDayStrip", () => {
    it("names each day's runs and failures on hover, counting a single run as one", async () => {
        const wrapper = await mountSuspended(TelemetryDayStrip, {
            props: {
                days: ["2026-11-05", "2026-11-06"],
                usage: [
                    { runs: 1, agent: 0, failures: 0 },
                    { runs: 4, agent: 2, failures: 2 },
                ],
                busiest: 4,
            },
        });

        expect(wrapper.findAll("li").map((cell) => cell.attributes("title"))).toEqual([
            "5 Nov · 1 run",
            "6 Nov · 4 runs · 2 failed",
        ]);
    });

    it("counts a day the usage has no entry for as no runs", async () => {
        const wrapper = await mountSuspended(TelemetryDayStrip, {
            props: { days: ["2026-11-05"], usage: [], busiest: 1 },
        });

        expect(wrapper.find("li").attributes("title")).toBe("5 Nov · 0 runs");
    });
});
