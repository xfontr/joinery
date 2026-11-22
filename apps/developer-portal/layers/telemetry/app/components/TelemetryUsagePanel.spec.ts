import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ScriptUsage } from "#layers/snapshot/shared/types/ScriptUsage.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import TelemetryUsagePanel from "./TelemetryUsagePanel.vue";

const artifacts = vi.hoisted(() => ({ usage: null as UsageArtifact | null }));
mockNuxtImport("usageArtifact", () => () => artifacts.usage);

beforeEach(() => {
    artifacts.usage = null;
});

const script = (runs: number, agent: number, failures: number): ScriptUsage => ({
    runs,
    recent: runs,
    failures,
    headless: agent,
    totalMs: 0,
    first: "2026-11-09",
    last: "2026-11-09",
    callers: {},
    commands: {},
    targets: {},
    areas: {},
    flags: {},
    days: { "2026-11-09": { runs, agent, failures } },
});

const USAGE: UsageArtifact = {
    generatedAt: "2026-11-10T00:00:00Z",
    windowDays: 90,
    known: ["lint", "check", "idle"],
    scripts: {
        lint: script(10, 6, 0),
        check: script(10, 4, 5),
    },
    lint: { since: null, rules: {} },
};

const open = async (usage: UsageArtifact | null) => {
    artifacts.usage = usage;
    const wrapper = await mountSuspended(TelemetryUsagePanel);
    await flushPromises();
    return wrapper;
};

describe("TelemetryUsagePanel", () => {
    it("counts runs as a number and the agent and failure shares as percentages", async () => {
        const wrapper = await open(USAGE);

        expect(wrapper.findAll("dd").map((figure) => figure.text())).toEqual(["20", "50%", "25%"]);
    });

    it("names each failing script and counts the scripts never run", async () => {
        const wrapper = await open(USAGE);

        expect(wrapper.text()).toContain("check");
        expect(wrapper.text()).toContain("50% failed");
        expect(wrapper.text()).toContain("1 script never run");
    });

    it("says the usage was never collected instead of printing zeros", async () => {
        const wrapper = await open(null);

        expect(wrapper.text()).toContain("Not collected.");
        expect(wrapper.find("dd").exists()).toBe(false);
    });
});
