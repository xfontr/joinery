import { describe, expect, it } from "vitest";
import { durationsOf, parseLog, summarize, summarizeTasks, type UsageRecord } from "./usage.ts";

const NOW = "2026-11-09T00:00:00.000Z";

const record = (overrides: Partial<UsageRecord> = {}): UsageRecord => ({
    at: "2026-11-08",
    script: "issue",
    command: "pick",
    target: "",
    flags: "",
    area: "repo",
    caller: "human",
    exit: "0",
    outcome: "ok",
    error: "",
    ms: "100",
    ...overrides,
});

describe("parseLog", () => {
    it("reads cells by the header's names, so a reordered or added column still parses", () => {
        const text = "script,extra,at\nmap,x,2026-11-08\n";

        expect(parseLog(text)).toEqual([{ script: "map", extra: "x", at: "2026-11-08" }]);
    });

    it("skips a line whose cell count doesn't match the header", () => {
        expect(parseLog("at,script\n2026-11-08\n2026-11-08,map\n")).toHaveLength(1);
    });
});

describe("summarize", () => {
    it("counts runs, failures, callers, commands, targets, areas and flags per script", () => {
        const { scripts } = summarize(
            [
                record({ flags: "type=fix;check" }),
                record({
                    exit: "1",
                    outcome: "crash",
                    caller: "claude-code",
                    target: "ui",
                    flags: "check",
                }),
            ],
            [],
            NOW,
        );

        expect(scripts.issue).toMatchObject({
            runs: 2,
            failures: 1,
            headless: 1,
            totalMs: 200,
            callers: { human: 1, "claude-code": 1 },
            commands: { pick: 2 },
            targets: { ui: 1 },
            flags: { check: 2, "type=fix": 1 },
        });
    });

    it("doesn't count a Ctrl+C as a failure", () => {
        const run = record({ exit: "130", outcome: "interrupted" });

        expect(summarize([run], [], NOW).scripts.issue?.failures).toBe(0);
    });

    it("counts a run a day before the window in the total only, and the window's first day in both", () => {
        const { scripts } = summarize(
            [
                record(),
                record({ at: "2026-01-01" }),
                record({ at: "2026-08-11" }),
                record({ at: "2026-08-12" }),
            ],
            [],
            NOW,
        );

        expect(scripts.issue).toMatchObject({
            runs: 4,
            recent: 2,
            first: "2026-01-01",
        });
    });

    it("counts each window day's runs, agent runs and failures, and leaves older days out", () => {
        const { scripts } = summarize(
            [
                record({ at: "2026-11-08T13:04:27.729Z" }),
                record({ caller: "claude-code", exit: "1", outcome: "refused" }),
                record({ at: "2026-01-01" }),
            ],
            [],
            NOW,
        );

        expect(scripts.issue?.days).toEqual({
            "2026-11-08": { runs: 2, agent: 1, failures: 1, known: 2 },
        });
    });
});

describe("summarize with outcomes", () => {
    // Before `outcome`, a `--check` that found drift exited 1 exactly like a crash did.
    it("counts refusals and crashes as failures, never a check's finding or an unknown", () => {
        const { scripts } = summarize(
            [
                record({ exit: "1", outcome: "finding" }),
                record({ exit: "1", outcome: "refused" }),
                record({ exit: "1", outcome: "crash", error: "gh:exit" }),
                record({ exit: "1", outcome: "" }),
            ],
            [],
            NOW,
        );

        expect(scripts.issue).toMatchObject({
            failures: 2,
            outcomes: { finding: 1, refused: 1, crash: 1 },
            errors: { "gh:exit": 1 },
        });
    });

    // Carried-over rows have no outcome, and a guess would put them in the failure rate.
    it("leaves a run with no recorded outcome out of failures and the rates' base", () => {
        const { scripts } = summarize([record({ exit: "1", outcome: "" })], [], NOW);

        expect(scripts.issue).toMatchObject({ runs: 1, failures: 0, outcomes: {} });
        expect(Object.values(scripts.issue?.days ?? {})[0]).toMatchObject({ runs: 1, known: 0 });
    });

    it("times only runs that ran to an end, not a Ctrl+C, a cancel or an untimed old row", () => {
        const { scripts } = summarize(
            [
                record({ ms: "100" }),
                record({ ms: "300", command: "brief" }),
                record({ ms: "9000000", outcome: "interrupted" }),
                record({ ms: "5000", outcome: "cancelled" }),
                record({ ms: "", outcome: "" }),
            ],
            [],
            NOW,
        );

        expect(scripts.issue?.durations).toEqual({ runs: 2, medianMs: 100, p90Ms: 300 });
        expect(scripts.issue?.commandDurations).toEqual({
            pick: { runs: 1, medianMs: 100, p90Ms: 100 },
            brief: { runs: 1, medianMs: 300, p90Ms: 300 },
        });
    });
});

describe("durationsOf", () => {
    it("takes the median and 90th percentile by nearest rank, whatever the order", () => {
        expect(durationsOf([10, 1, 9, 2, 8, 3, 7, 4, 6, 5])).toEqual({
            runs: 10,
            medianMs: 5,
            p90Ms: 9,
        });
        expect(durationsOf([])).toBeNull();
    });
});

describe("summarizeTasks", () => {
    const task = (overrides: Partial<UsageRecord> = {}): UsageRecord => ({
        at: "2026-11-08",
        run: "a1b2c3d4",
        trigger: "check",
        hook: "",
        caller: "human",
        area: "repo",
        project: "scripts",
        target: "test",
        cache: "miss",
        exit: "0",
        ms: "8000",
        load: "0.40",
        ...overrides,
    });

    it("times cache misses only, so a hit's near-zero restore can't pull the median down", () => {
        const tasks = summarizeTasks(
            [task(), task({ ms: "12000" }), task({ cache: "hit", ms: "5" })],
            NOW,
        );

        expect(tasks.test).toMatchObject({
            runs: 3,
            hits: 1,
            misses: { runs: 2, medianMs: 8000, p90Ms: 12000 },
        });
    });

    it("splits the times by caller and by the hook that ran them", () => {
        const tasks = summarizeTasks(
            [task(), task({ caller: "claude-code", hook: "pre-push", ms: "20000" })],
            NOW,
        );

        expect(Object.keys(tasks.test?.byCaller ?? {})).toEqual(["human", "claude-code"]);
        expect(tasks.test?.byHook["pre-push"]).toEqual({ runs: 1, medianMs: 20000, p90Ms: 20000 });
        expect(tasks.test?.byHook.none?.runs).toBe(1);
    });

    it("leaves out runs from before the window", () => {
        expect(summarizeTasks([task({ at: "2025-01-01" })], NOW)).toEqual({});
    });
});
