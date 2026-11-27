import { describe, expect, it } from "vitest";
import type { LintRuleUsage } from "#layers/snapshot/shared/types/LintRuleUsage.ts";
import type { ScriptUsage } from "#layers/snapshot/shared/types/ScriptUsage.ts";
import type { TaskUsage } from "#layers/snapshot/shared/types/TaskUsage.ts";
import {
    ciBuildTimes,
    dailyTotals,
    failureCauseRows,
    formatMs,
    lintTable,
    localBuildTimes,
    ruleQuadrants,
    scriptQuadrants,
    scriptRows,
    shownDays,
    windowDays,
} from "./usageView.ts";

const NOW = "2026-11-09T07:00:00.000Z";

const usage = (overrides: Partial<ScriptUsage> = {}): ScriptUsage => ({
    runs: 0,
    recent: 0,
    failures: 0,
    headless: 0,
    totalMs: 0,
    first: "2026-11-01",
    last: "2026-11-08",
    callers: {},
    commands: {},
    targets: {},
    areas: {},
    flags: {},
    days: {},
    ...overrides,
});

const rule = (overrides: Partial<LintRuleUsage> = {}): LintRuleUsage => ({
    enabled: true,
    hits: 0,
    recent: 0,
    fixable: 0,
    last: null,
    projects: {},
    disabled: 0,
    ...overrides,
});

describe("windowDays", () => {
    it("runs from the window's first day through the snapshot's, so the matrix matches `recent`", () => {
        const days = windowDays(NOW);

        expect(days[0]).toBe("2026-08-12");
        expect(days.at(-1)).toBe("2026-11-09");
        expect(days).toHaveLength(90);
    });
});

describe("shownDays", () => {
    it("starts the strip at the first recorded run instead of months of empty days", () => {
        const days = shownDays({
            generatedAt: NOW,
            scripts: {
                map: usage({
                    days: { "2026-10-01": { runs: 1, agent: 1, failures: 0, known: 1 } },
                }),
            },
        });

        expect(days[0]).toBe("2026-10-01");
        expect(days.at(-1)).toBe("2026-11-09");
    });

    it("still shows two weeks when recording began yesterday", () => {
        const days = shownDays({
            generatedAt: NOW,
            scripts: {
                map: usage({
                    days: { "2026-11-08": { runs: 1, agent: 1, failures: 0, known: 1 } },
                }),
            },
        });

        expect(days).toHaveLength(14);
    });
});

describe("scriptRows", () => {
    it("gives a known script with no run a row of its own, last and empty, instead of dropping it", () => {
        const rows = scriptRows({
            generatedAt: NOW,
            windowDays: 90,
            known: ["drift", "map"],
            scripts: {
                map: usage({
                    days: { "2026-11-08": { runs: 2, agent: 1, failures: 0, known: 2 } },
                }),
            },
        });

        expect(rows.map((row) => [row.name, row.runs, row.last])).toEqual([
            ["map", 2, "2026-11-08"],
            ["drift", 0, null],
        ]);
    });

    it("sums runs from the window's days only, so an old busy script doesn't outrank a fresh one", () => {
        const rows = scriptRows({
            generatedAt: NOW,
            windowDays: 90,
            known: [],
            scripts: {
                old: usage({ runs: 500, days: {} }),
                fresh: usage({
                    days: { "2026-11-09": { runs: 1, agent: 0, failures: 0, known: 1 } },
                }),
            },
        });

        expect(rows.map((row) => row.name)).toEqual(["fresh", "old"]);
    });

    it.each([
        [4, 4, false],
        [8, 2, true],
        [8, 1, false],
    ])("marks %i runs with %i failures failing: %s", (runs, failures, failing) => {
        const [row] = scriptRows({
            generatedAt: NOW,
            windowDays: 90,
            known: [],
            scripts: {
                ci: usage({ days: { "2026-11-08": { runs, agent: runs, failures, known: runs } } }),
            },
        });

        expect(row?.failing).toBe(failing);
    });
});

describe("dailyTotals", () => {
    it("sums the same day across scripts, so the total row never drops one", () => {
        const rows = scriptRows({
            generatedAt: NOW,
            windowDays: 90,
            known: [],
            scripts: {
                a: usage({ days: { "2026-11-09": { runs: 2, agent: 2, failures: 1, known: 2 } } }),
                b: usage({ days: { "2026-11-09": { runs: 3, agent: 0, failures: 0, known: 3 } } }),
            },
        });

        expect(dailyTotals(rows).at(-1)).toEqual({ runs: 5, agent: 2, failures: 1, known: 5 });
    });
});

describe("lintTable", () => {
    it("orders project columns busiest first and fills a project a rule never hit with zero", () => {
        const table = lintTable({
            since: "2026-11-01",
            rules: {
                prettier: rule({ hits: 9, recent: 9, projects: { ui: 2, portal: 7 } }),
                "no-console": rule({ disabled: 4 }),
                quiet: rule(),
                old: rule({ hits: 40 }),
            },
        });

        expect(table.projects).toEqual(["portal", "ui"]);
        expect(table.rows.map((row) => [row.rule, row.projects])).toEqual([
            ["prettier", [7, 2]],
            ["no-console", [0, 0]],
        ]);
    });
});

describe("scriptRows on an older snapshot", () => {
    it("counts a script collected before per-day counts by its runs in the window, not as idle", () => {
        const old = usage({ runs: 40, recent: 12 });
        delete old.days;

        const rows = scriptRows({ generatedAt: NOW, windowDays: 90, known: [], scripts: { old } });

        expect(rows.map((row) => [row.name, row.runs])).toEqual([["old", 12]]);
    });
});

describe("scriptQuadrants", () => {
    it("draws the failing threshold where the alert fires and leaves idle scripts off the plot", () => {
        const rows = scriptRows({
            generatedAt: NOW,
            windowDays: 90,
            known: ["idle"],
            scripts: {
                ci: usage({ days: { "2026-11-08": { runs: 8, agent: 8, failures: 2, known: 8 } } }),
            },
        });

        const chart = scriptQuadrants(rows);

        expect(chart.points.map((point) => [point.name, point.kind])).toEqual([["ci", "agents"]]);
        expect(chart.points[0]?.y).toBe(chart.y.threshold);
    });

    it("places more runs further right, so the busiest script reads as such", () => {
        const rows = scriptRows({
            generatedAt: NOW,
            windowDays: 90,
            known: [],
            scripts: {
                busy: usage({
                    days: { "2026-11-08": { runs: 90, agent: 0, failures: 0, known: 90 } },
                }),
                rare: usage({
                    days: { "2026-11-08": { runs: 2, agent: 1, failures: 0, known: 2 } },
                }),
            },
        });

        const [busy, rare] = scriptQuadrants(rows).points;

        expect(busy?.x).toBeGreaterThan(rare?.x ?? Infinity);
        expect([busy?.kind, rare?.kind]).toEqual(["people", "both"]);
    });
});

describe("ruleQuadrants", () => {
    it("puts a rule that is only ever disabled in the zero lane and names it once it is fought", () => {
        const chart = ruleQuadrants({
            since: "2026-11-01",
            rules: {
                prettier: rule({ hits: 9, recent: 9, fixable: 9 }),
                "no-console": rule({ disabled: 22 }),
                quiet: rule(),
            },
        });

        const byName = Object.fromEntries(chart.points.map((point) => [point.name, point]));

        expect(Object.keys(byName)).toEqual(["prettier", "no-console"]);
        expect(byName["no-console"]).toMatchObject({
            x: chart.x.ticks[0]?.at,
            labelled: true,
            kind: "manual",
        });
        expect(byName["no-console"]?.x).toBeGreaterThan(0);
        expect(byName.prettier?.kind).toBe("auto");
    });
});

describe("ruleQuadrants threshold", () => {
    it.each([1, 2])("keeps the noisy line on the plot with %i hit in the window", (recent) => {
        const chart = ruleQuadrants({
            since: "2026-11-01",
            rules: { a: rule({ hits: recent, recent }) },
        });

        expect(chart.x.threshold).toBeGreaterThanOrEqual(0);
        expect(chart.x.threshold).toBeLessThanOrEqual(100);
    });

    it("puts every disabled-count tick on a whole number", () => {
        const chart = ruleQuadrants({ since: "2026-11-01", rules: { a: rule({ disabled: 22 }) } });

        expect(chart.y.ticks.map(({ label }) => Number(label) % 1)).toEqual([0, 0, 0, 0, 0]);
    });
});

describe("failure rate", () => {
    // Rows carried over from before outcomes were kept would otherwise dilute the rate.
    it("divides by the runs whose outcome is known, so unclassified runs never dilute it", () => {
        const [row] = scriptRows({
            generatedAt: NOW,
            windowDays: 90,
            known: [],
            scripts: {
                ci: usage({
                    days: { "2026-11-08": { runs: 40, agent: 40, failures: 2, known: 8 } },
                }),
            },
        });

        expect(row?.failing).toBe(true);
    });

    it("leaves a script with no classified run off the triage chart instead of plotting it at 0%", () => {
        const rows = scriptRows({
            generatedAt: NOW,
            windowDays: 90,
            known: [],
            scripts: {
                old: usage({
                    days: { "2026-11-08": { runs: 9, agent: 9, failures: 0, known: 0 } },
                }),
            },
        });

        expect(scriptQuadrants(rows).points).toEqual([]);
    });
});

describe("formatMs", () => {
    it("keeps one unit per size, so a column of times compares at a glance", () => {
        expect(formatMs(820)).toBe("820 ms");
        expect(formatMs(12_700)).toBe("12.7 s");
        expect(formatMs(330_000)).toBe("5.5 min");
    });
});

const task = (overrides: Partial<TaskUsage> = {}): TaskUsage => ({
    runs: 4,
    hits: 1,
    misses: { runs: 3, medianMs: 8000, p90Ms: 12_000 },
    byCaller: {},
    byHook: {},
    ...overrides,
});

describe("localBuildTimes", () => {
    it("puts the whole check first, then each target slowest first", () => {
        const rows = localBuildTimes({
            scripts: {
                tasks: usage({
                    commandDurations: { check: { runs: 2, medianMs: 36_000, p90Ms: 40_000 } },
                }),
            },
            tasks: {
                typecheck: task({ misses: { runs: 3, medianMs: 4900, p90Ms: 9400 } }),
                "eslint:lint": task({
                    misses: { runs: 3, medianMs: 12_700, p90Ms: 28_000 },
                    byHook: { "pre-push": { runs: 1, medianMs: 20_000, p90Ms: 20_000 } },
                }),
            },
        });

        expect(rows.map((row) => row.name)).toEqual(["check", "eslint:lint", "typecheck"]);
        expect(rows[1]).toMatchObject({ prePushMs: 20_000, hitShare: 0.25 });
    });

    it("keeps a target with only cache hits, untimed, rather than dropping it", () => {
        const rows = localBuildTimes({
            scripts: {},
            tasks: { test: task({ hits: 4, misses: null }) },
        });

        expect(rows).toEqual([
            { name: "test", kind: "target", durations: null, prePushMs: null, hitShare: 1 },
        ]);
    });
});

describe("ciBuildTimes", () => {
    it("lists the steps before the jobs, and nothing when GitHub wasn't read", () => {
        const rows = ciBuildTimes({
            ci: {
                runs: 20,
                jobs: { e2e: { runs: 20, medianMs: 395_000, p90Ms: 490_000 } },
                steps: { "nx test:e2e": { runs: 20, medianMs: 330_000, p90Ms: 436_000 } },
            },
        });

        expect(rows.map((row) => [row.kind, row.name])).toEqual([
            ["step", "nx test:e2e"],
            ["job", "e2e"],
        ]);
        expect(ciBuildTimes({ ci: null })).toEqual([]);
    });
});

describe("failureCauseRows", () => {
    it("lists only scripts that failed, with each crash kind and the runs left unclassified", () => {
        const rows = failureCauseRows({
            scripts: {
                workflow: usage({
                    runs: 10,
                    outcomes: { ok: 4, refused: 3, crash: 1 },
                    errors: { "gh:exit": 1 },
                }),
                map: usage({ runs: 5, outcomes: { ok: 3, finding: 2 } }),
            },
        });

        expect(rows).toEqual([
            {
                name: "workflow",
                refused: 3,
                usage: 0,
                crash: 1,
                crashes: "gh:exit ×1",
                unknown: 2,
            },
        ]);
    });
});
