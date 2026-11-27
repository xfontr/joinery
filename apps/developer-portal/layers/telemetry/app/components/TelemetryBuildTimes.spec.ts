import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import TelemetryBuildTimes from "./TelemetryBuildTimes.vue";

type Usage = Pick<UsageArtifact, "scripts" | "tasks" | "ci">;

const cells = (wrapper: VueWrapper): string[][] =>
    wrapper
        .findAll("tbody tr")
        .map((row) => row.findAll("td").map((td) => td.text()))
        .filter((row) => row.length > 0);

describe("TelemetryBuildTimes", () => {
    it("shows a target's median, slowest runs, pre-push time and cache hit rate", async () => {
        const usage: Usage = {
            scripts: {},
            tasks: {
                test: {
                    runs: 4,
                    hits: 1,
                    misses: { runs: 3, medianMs: 8200, p90Ms: 18_900 },
                    byCaller: {},
                    byHook: { "pre-push": { runs: 1, medianMs: 9000, p90Ms: 9000 } },
                },
            },
            ci: null,
        };

        const wrapper = await mountSuspended(TelemetryBuildTimes, { props: { usage } });

        expect(cells(wrapper)).toContainEqual(["test", "8.2 s", "18.9 s", "9.0 s", "3", "25%"]);
    });

    it("says why the CI section is empty when GitHub couldn't be read", async () => {
        const wrapper = await mountSuspended(TelemetryBuildTimes, {
            props: { usage: { scripts: {}, tasks: {}, ci: null } },
        });

        expect(cells(wrapper)).toEqual([
            ["telemetryBuildTimes.emptyLocal"],
            ["telemetryBuildTimes.ciUnread"],
        ]);
    });
});
