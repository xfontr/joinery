import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import type { ScriptUsage } from "#layers/snapshot/shared/types/ScriptUsage.ts";
import type { SnapshotResponse } from "#layers/snapshot/shared/types/SnapshotResponse.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import Page from "./telemetry.vue";

// Each panel has its own spec; here only the page's own totals are under test
const global = {
    stubs: {
        TelemetryScriptActivity: true,
        TelemetryUsageTriage: true,
        TelemetryLintUsage: true,
    },
};

const tally = (overrides: Partial<ScriptUsage> = {}): ScriptUsage => ({
    runs: 10,
    recent: 10,
    failures: 1,
    headless: 0,
    totalMs: 100,
    first: "2026-11-01",
    last: "2026-11-08",
    callers: { "claude-code": 4, human: 6 },
    commands: {},
    targets: {},
    areas: { content: 6, repo: 4 },
    flags: { check: 3 },
    days: { "2026-11-08": { runs: 10, agent: 4, failures: 1 } },
    ...overrides,
});

const serve = (usage: UsageArtifact | null) => {
    serveEndpoint("/api/snapshot/usage", (): SnapshotResponse => ({
        manifest: null,
        usage,
    }));
};

const usage = (
    scripts: Record<string, ScriptUsage>,
    known = Object.keys(scripts),
): UsageArtifact => ({
    generatedAt: "2026-11-09T00:00:00.000Z",
    windowDays: 90,
    lint: { since: null, rules: {} },
    known,
    scripts,
});

const tiles = (wrapper: VueWrapper) =>
    Object.fromEntries(
        wrapper
            .findAllComponents({ name: "StatTile" })
            .map((tile) => [tile.props("label"), String(tile.props("value"))]),
    );

describe("telemetry page", () => {
    it("says nothing has been folded yet instead of showing an empty matrix as a result", async () => {
        serve(null);
        const wrapper = await mountSuspended(Page, { global });

        expect(wrapper.text()).toContain("No runs committed yet");
        expect(tiles(wrapper)).toEqual({});
    });

    it("totals the window's runs, agent and failure shares, and counts a script with none as idle", async () => {
        serve(
            usage(
                {
                    drift: tally(),
                    map: tally({
                        runs: 500,
                        days: { "2026-11-08": { runs: 30, agent: 0, failures: 1 } },
                    }),
                },
                ["drift", "map", "ship"],
            ),
        );
        const wrapper = await mountSuspended(Page, { global });

        expect(tiles(wrapper)).toMatchObject({
            Runs: "40",
            "Run by an agent": "10%",
            Failed: "5%",
            "Idle scripts": "1/3",
        });
    });
});
