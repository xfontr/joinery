import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DayUsage } from "#layers/snapshot/shared/types/DayUsage.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";

const store = vi.hoisted(() => ({ readArtifact: vi.fn() }));
const h3 = vi.hoisted(() => ({ defineEventHandler: (handler: unknown) => handler }));

vi.mock("#layers/snapshot/server/utils/store.ts", () => store);
vi.mock("h3", () => h3);

import handler from "./figure.get.ts";

const GENERATED = "2026-11-19T12:00:00Z";

const usage = (day: DayUsage): UsageArtifact => ({
    generatedAt: GENERATED,
    windowDays: 90,
    known: ["check"],
    scripts: {
        check: {
            runs: day.runs,
            recent: day.runs,
            failures: day.failures,
            headless: 0,
            totalMs: 0,
            first: GENERATED,
            last: GENERATED,
            callers: {},
            commands: {},
            targets: {},
            areas: {},
            flags: {},
            days: { "2026-11-19": day },
        },
    },
    lint: { since: null, rules: {} },
});

beforeEach(() => {
    vi.clearAllMocks();
});

describe("telemetry figure route", () => {
    it("prints a dash, not 0%, when nothing was collected or nothing ran", async () => {
        store.readArtifact.mockResolvedValue(null);

        await expect(handler({} as never)).resolves.toEqual({ value: "—", alert: false });
    });

    it("alerts once enough runs fail", async () => {
        store.readArtifact.mockResolvedValue(usage({ runs: 8, agent: 0, failures: 4 }));

        await expect(handler({} as never)).resolves.toEqual({ value: "50%", alert: true });
    });

    it("stays quiet under the failing rate", async () => {
        store.readArtifact.mockResolvedValue(usage({ runs: 10, agent: 0, failures: 1 }));

        await expect(handler({} as never)).resolves.toEqual({ value: "10%", alert: false });
    });
});
