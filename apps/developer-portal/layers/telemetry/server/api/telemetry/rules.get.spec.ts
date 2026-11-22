import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LintRuleUsage } from "#layers/snapshot/shared/types/LintRuleUsage.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";

const store = vi.hoisted(() => ({ readArtifact: vi.fn() }));
const h3 = vi.hoisted(() => ({ defineEventHandler: (handler: unknown) => handler }));

vi.mock("#layers/snapshot/server/utils/store.ts", () => store);
vi.mock("h3", () => h3);

import handler from "./rules.get.ts";

const rule = (enabled: boolean): LintRuleUsage => ({
    enabled,
    hits: 0,
    recent: 0,
    fixable: 0,
    last: null,
    projects: {},
    disabled: 0,
});

const usage = (rules: Record<string, LintRuleUsage>): UsageArtifact => ({
    generatedAt: "2026-11-01T00:00:00Z",
    windowDays: 30,
    known: [],
    scripts: {},
    lint: { since: null, rules },
});

beforeEach(() => {
    vi.clearAllMocks();
});

describe("telemetry rules route", () => {
    it("answers null when nothing was collected, so the page keeps its uncounted proof", async () => {
        store.readArtifact.mockResolvedValue(null);

        await expect(handler({} as never)).resolves.toBeNull();
    });

    it("counts only switched-on rules, and the in-house ones among them", async () => {
        store.readArtifact.mockResolvedValue(
            usage({
                "no-console": rule(true),
                "monorepo/no-build-step": rule(true),
                "monorepo/retired": rule(false),
            }),
        );

        await expect(handler({} as never)).resolves.toEqual({ enabled: 2, inHouse: 1 });
    });
});
