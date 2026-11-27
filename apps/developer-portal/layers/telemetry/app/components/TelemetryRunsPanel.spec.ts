import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import TelemetryRunsPanel from "./TelemetryRunsPanel.vue";

const artifacts = vi.hoisted(() => ({ usage: null as UsageArtifact | null }));
mockNuxtImport("usageArtifact", () => () => artifacts.usage);

beforeEach(() => {
    artifacts.usage = null;
});

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
            days: { "2026-11-09": { runs: 5, agent: 0, failures: 0, known: 5 } },
        },
    },
    lint: { since: null, rules: {} },
} satisfies UsageArtifact;

const open = async (usage: UsageArtifact | null) => {
    artifacts.usage = usage;
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
