import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import TelemetryUsageTriage from "./TelemetryUsageTriage.vue";

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
            days: { "2026-11-09": { runs: 6, agent: 0, failures: 0 } },
        },
    },
    lint: { since: null, rules: {} },
} satisfies UsageArtifact;

describe("TelemetryUsageTriage", () => {
    it("plots each script that ran and names the ones that never did", async () => {
        const wrapper = await mountSuspended(TelemetryUsageTriage, { props: { usage: USAGE } });

        expect(wrapper.find("span[title^='lint']").exists()).toBe(true);
        expect(wrapper.text()).toContain("idle (never run)");
    });
});
