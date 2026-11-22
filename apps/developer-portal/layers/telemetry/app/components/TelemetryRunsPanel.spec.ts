import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import type { SnapshotResponse } from "#layers/snapshot/shared/types/SnapshotResponse.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import TelemetryRunsPanel from "./TelemetryRunsPanel.vue";

const USAGE = {
    generatedAt: "2026-11-10T00:00:00Z",
    windowDays: 90,
    known: ["lint"],
    scripts: {
        lint: {
            runs: 5,
            recent: 5,
            failures: 0,
            headless: 0,
            totalMs: 0,
            first: "2026-11-09",
            last: "2026-11-09",
            callers: {},
            commands: {},
            targets: {},
            areas: {},
            flags: {},
            days: { "2026-11-09": { runs: 5, agent: 0, failures: 0 } },
        },
    },
    lint: { since: null, rules: {} },
} satisfies UsageArtifact;

const open = async (usage: UsageArtifact | null) => {
    serveEndpoint("/api/snapshot/usage", (): SnapshotResponse => ({ manifest: null, usage }));
    const wrapper = await mountSuspended(TelemetryRunsPanel);
    await flushPromises();
    return wrapper;
};

describe("TelemetryRunsPanel", () => {
    it("charts the runs per day and links to the full page", async () => {
        const wrapper = await open(USAGE);

        expect(wrapper.findComponent({ name: "DailyChart" }).props("values")).toContain(5);
        expect(wrapper.find("a[href='/telemetry']").exists()).toBe(true);
    });

    it("charts no day when nothing was collected", async () => {
        const wrapper = await open(null);

        expect(wrapper.findComponent({ name: "DailyChart" }).props("days")).toEqual([]);
    });
});
