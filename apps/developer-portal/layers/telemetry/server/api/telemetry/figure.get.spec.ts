import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DayUsage } from "#layers/snapshot/shared/types/DayUsage.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";

vi.mock("h3", () => ({ defineEventHandler: (handler: unknown) => handler }));

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

let dir = "";

const artifact = (name: string, value: unknown) =>
    writeFile(join(dir, `${name}.json`), JSON.stringify(value));

beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "snapshot-"));
    vi.stubGlobal("useRuntimeConfig", () => ({ snapshotDir: dir }));
});

afterEach(async () => {
    vi.unstubAllGlobals();
    await rm(dir, { recursive: true, force: true });
});

describe("telemetry figure route", () => {
    it("prints a dash, not 0%, when nothing was collected or nothing ran", async () => {
        await expect(handler({} as never)).resolves.toEqual({ value: "—", alert: false });
    });

    it("alerts once enough runs fail", async () => {
        await artifact("usage", usage({ runs: 8, agent: 0, failures: 4, known: 8 }));

        await expect(handler({} as never)).resolves.toEqual({ value: "50%", alert: true });
    });

    it("stays quiet under the failing rate", async () => {
        await artifact("usage", usage({ runs: 10, agent: 0, failures: 1, known: 10 }));

        await expect(handler({} as never)).resolves.toEqual({ value: "10%", alert: false });
    });
});
