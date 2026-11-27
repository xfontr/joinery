import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import TelemetryUsageTriage from "./TelemetryUsageTriage.vue";

const MESSAGES = {
    telemetryUsageTriage: {
        callers: {
            agents: "Agents only",
            both: "Both",
            people: "People only",
        },
        fixes: {
            auto: "Always auto-fixed",
            manual: "Needs a manual fix",
        },
        idle: "Not plotted, no run in the window: {list}",
        idleNever: "{name} (never run)",
        ruleCorners: {
            fought: "Fires and fought",
            noisy: "Noisy · tell agents, or narrow it",
            wrong: "Switched off, never fires · rule or code wrong",
        },
        rules: {
            meta: "Agent-edit hits against eslint-disable · dashed at {disables} disables and {percent}% of hits",
            title: "Lint rules: how often it fires vs how often it's switched off",
            x: "Hits in the window, log scale",
            y: "Disabled inline",
        },
        scriptCorners: {
            fixFirst: "Used and failing · fix first",
            rare: "Rare and failing",
            rarelyRun: "Rarely run · still needed?",
            workhorses: "Workhorses",
        },
        scripts: {
            meta: "One dot per script · dashed at {runs} runs and {percent}% failing",
            point: "{name} · {runs} runs · {failed}% failed · {agent} by agents",
            title: "Scripts: how often vs how often it fails",
            x: "Runs in the window, log scale",
            y: "Runs that failed",
        },
    },
};

const USAGE = {
    generatedAt: "2026-11-10T00:00:00Z",
    windowDays: 90,
    known: ["lint", "idle"],
    scripts: {
        lint: {
            runs: 6,
            recent: 6,
            failures: 0,
            headless: 0,
            totalMs: 0,
            first: "2026-11-08",
            last: "2026-11-09",
            callers: {},
            commands: {},
            targets: {},
            areas: {},
            flags: {},
            days: { "2026-11-09": { runs: 6, agent: 0, failures: 0, known: 6 } },
        },
    },
    lint: { since: null, rules: {} },
} satisfies UsageArtifact;

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("TelemetryUsageTriage", () => {
    it("plots each script that ran and names the ones that never did", async () => {
        const wrapper = await mountSuspended(TelemetryUsageTriage, { props: { usage: USAGE } });

        expect(wrapper.find("span[title^='lint']").exists()).toBe(true);
        expect(wrapper.text()).toContain("idle (never run)");
    });
});
