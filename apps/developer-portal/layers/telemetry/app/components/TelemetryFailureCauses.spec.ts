import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { ScriptUsage } from "#layers/snapshot/shared/types/ScriptUsage.ts";
import TelemetryFailureCauses from "./TelemetryFailureCauses.vue";

const workflow: ScriptUsage = {
    runs: 10,
    recent: 10,
    failures: 4,
    headless: 10,
    totalMs: 0,
    first: "2026-11-08",
    last: "2026-11-08",
    callers: {},
    commands: {},
    targets: {},
    areas: {},
    flags: {},
    outcomes: { ok: 4, refused: 3, crash: 1 },
    errors: { "gh:exit": 1 },
};

describe("TelemetryFailureCauses", () => {
    it("splits a script's failures by cause and marks a crash in the bad tone", async () => {
        const wrapper = await mountSuspended(TelemetryFailureCauses, {
            props: { usage: { scripts: { workflow } } },
        });

        const row = wrapper.find("tbody tr");

        expect(row.findAll("td").map((td) => td.text())).toEqual([
            "workflow",
            "3",
            "—",
            "1",
            "gh:exit ×1",
            "2",
        ]);
        expect(row.findAll("td")[3]?.classes()).toContain("tone-bad");
    });
});
