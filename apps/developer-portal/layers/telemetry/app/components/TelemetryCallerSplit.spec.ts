import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import TelemetryCallerSplit from "./TelemetryCallerSplit.vue";

const MESSAGES = {
    telemetryCallerSplit: {
        split: "{agent} by agents, {people} by people",
    },
};

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("TelemetryCallerSplit", () => {
    it("splits the bar by share and names both counts on hover", async () => {
        const wrapper = await mountSuspended(TelemetryCallerSplit, {
            props: { runs: 4, agent: 1 },
        });

        expect(wrapper.attributes("title")).toBe("1 by agents, 3 by people");
        expect(wrapper.findAll("span").map((part) => part.attributes("style"))).toEqual([
            expect.stringContaining("width: 25%"),
            expect.stringContaining("width: 75%"),
        ]);
    });

    it("draws no segment for a side with no runs", async () => {
        const wrapper = await mountSuspended(TelemetryCallerSplit, {
            props: { runs: 3, agent: 3 },
        });

        expect(wrapper.findAll("span")).toHaveLength(1);
    });
});
