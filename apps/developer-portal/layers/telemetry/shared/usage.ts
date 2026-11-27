import type { Durations } from "#layers/snapshot/shared/types/Durations.ts";
import type { ScriptUsage } from "#layers/snapshot/shared/types/ScriptUsage.ts";
import type { TaskUsage } from "#layers/snapshot/shared/types/TaskUsage.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";

/** Below this many runs a share of 100% is one data point, not a pattern. */
export const MIN_RUNS = 5;
export const WINDOW_DAYS = 90;
export const FAILING_RATE = 0.25;

const DAY_MS = 24 * 60 * 60 * 1000;
const HUMAN = "human";

const FAILED: ReadonlySet<string> = new Set(["refused", "usage", "crash"]);
/** Runs whose time is a person's, not the script's: a Ctrl+C or an answered-no prompt. */
const CUT_SHORT: ReadonlySet<string> = new Set(["interrupted", "cancelled"]);

/** One CSV row keyed by the header line of its file, which `@joinery/scripts` writes. */
export type UsageRecord = Record<string, string>;

/** Cells never hold a comma or a quote, so a plain split is the whole CSV grammar needed. */
export const parseLog = (text: string): UsageRecord[] => {
    const [header, ...lines] = text.split("\n");
    const columns = header?.split(",") ?? [];

    return lines
        .map((line) => line.split(","))
        .filter((cells) => cells.length === columns.length)
        .map((cells) => Object.fromEntries(columns.map((column, i) => [column, cells[i] ?? ""])))
        .filter((record) => record.at);
};

const bump = (counts: Record<string, number>, key: string | undefined): void => {
    if (key) counts[key] = (counts[key] ?? 0) + 1;
};

const sorted = (counts: Record<string, number>): Record<string, number> =>
    Object.fromEntries(Object.entries(counts).sort(([, a], [, b]) => b - a));

/** The first day inside the window, as `YYYY-MM-DD` like every recorded row. */
/** The window counts the snapshot's own day, so it starts `WINDOW_DAYS - 1` days before it. */
export const windowStart = (generatedAt: string): string =>
    new Date(Date.parse(generatedAt) - (WINDOW_DAYS - 1) * DAY_MS).toISOString().slice(0, 10);

const emptyUsage = (at: string): ScriptUsage => ({
    runs: 0,
    recent: 0,
    failures: 0,
    headless: 0,
    totalMs: 0,
    first: at,
    last: at,
    callers: {},
    commands: {},
    targets: {},
    areas: {},
    flags: {},
    outcomes: {},
    errors: {},
    days: {},
});

/** Blank for a row carried over from before outcomes were recorded: unknown, so never counted. */
const outcomeOf = ({ outcome }: UsageRecord): string => outcome ?? "";

const isFailure = (record: UsageRecord): boolean => FAILED.has(outcomeOf(record));

const isAgent = ({ caller }: UsageRecord): boolean => caller !== HUMAN;

/** Nearest rank; `null` for no runs. */
export const durationsOf = (values: number[]): Durations | null => {
    if (values.length === 0) return null;
    const ordered = [...values].sort((a, b) => a - b);
    const rank = (quantile: number): number =>
        ordered[Math.max(Math.ceil(quantile * ordered.length) - 1, 0)] ?? 0;

    return { runs: ordered.length, medianMs: rank(0.5), p90Ms: rank(0.9) };
};

const push = (lists: Record<string, number[]>, key: string, value: number): void => {
    lists[key] = [...(lists[key] ?? []), value];
};

/** `push` into the lists kept under `outer`, e.g. one target's times by caller. */
const pushUnder = (
    nested: Record<string, Record<string, number[]>>,
    outer: string,
    key: string,
    value: number,
): void => {
    const lists = nested[outer] ?? {};
    nested[outer] = lists;
    push(lists, key, value);
};

const durationsBy = (lists: Record<string, number[]>): Record<string, Durations> =>
    Object.fromEntries(
        Object.entries(lists).flatMap(([key, values]) => {
            const durations = durationsOf(values);
            return durations ? [[key, durations]] : [];
        }),
    );

/** A timed run inside the window, or `undefined` when its `ms` doesn't measure the tooling. */
const timedMs = (record: UsageRecord, at: string, since: string): number | undefined => {
    const ms = Number(record.ms);
    if (at < since || !record.ms || Number.isNaN(ms)) return undefined;
    if (CUT_SHORT.has(outcomeOf(record))) return undefined;
    return ms;
};

/** Older rows carry a full timestamp in `at`, newer ones only the day. */
const tallyDay = (usage: ScriptUsage, record: UsageRecord, at: string): void => {
    usage.days ??= {};
    const day = (usage.days[at.slice(0, 10)] ??= { runs: 0, agent: 0, failures: 0, known: 0 });
    day.runs += 1;
    if (outcomeOf(record)) day.known += 1;
    if (isAgent(record)) day.agent += 1;
    if (isFailure(record)) day.failures += 1;
};

const tally = (usage: ScriptUsage, record: UsageRecord, at: string, since: string): void => {
    usage.runs += 1;
    if (at >= since) {
        usage.recent += 1;
        tallyDay(usage, record, at);
    }
    if (isFailure(record)) usage.failures += 1;
    if (isAgent(record)) usage.headless += 1;
    usage.outcomes = { ...usage.outcomes };
    usage.errors = { ...usage.errors };
    bump(usage.outcomes, outcomeOf(record));
    bump(usage.errors, record.error);
    usage.totalMs += Number(record.ms) || 0;
    if (at < usage.first) usage.first = at;
    if (at > usage.last) usage.last = at;
    bump(usage.callers, record.caller);
    bump(usage.commands, record.command);
    bump(usage.targets, record.target);
    bump(usage.areas, record.area);
    for (const flag of record.flags?.split(";") ?? []) bump(usage.flags, flag);
};

export const summarize = (
    records: UsageRecord[],
    known: string[],
    generatedAt: string,
): Omit<UsageArtifact, "lint"> => {
    const since = windowStart(generatedAt);
    const scripts: Record<string, ScriptUsage> = {};
    const times: Record<string, number[]> = {};
    const commandTimes: Record<string, Record<string, number[]>> = {};

    for (const record of records) {
        const { at, script } = record;
        if (!at || !script) continue;
        const usage = scripts[script] ?? emptyUsage(at);
        scripts[script] = usage;
        tally(usage, record, at, since);

        const ms = timedMs(record, at, since);
        if (ms === undefined) continue;
        push(times, script, ms);
        if (record.command) pushUnder(commandTimes, script, record.command, ms);
    }

    for (const [script, usage] of Object.entries(scripts)) {
        usage.durations = durationsOf(times[script] ?? []);
        usage.commandDurations = durationsBy(commandTimes[script] ?? {});
        usage.outcomes = sorted(usage.outcomes ?? {});
        usage.errors = sorted(usage.errors ?? {});
        usage.callers = sorted(usage.callers);
        usage.commands = sorted(usage.commands);
        usage.targets = sorted(usage.targets);
        usage.areas = sorted(usage.areas);
        usage.flags = sorted(usage.flags);
    }

    return { generatedAt, windowDays: WINDOW_DAYS, known, scripts };
};

/** Per Nx target, inside the window; durations come from cache misses alone. */
export const summarizeTasks = (
    records: UsageRecord[],
    generatedAt: string,
): Record<string, TaskUsage> => {
    const since = windowStart(generatedAt);
    const counts: Record<string, { runs: number; hits: number }> = {};
    const misses: Record<string, number[]> = {};
    const byCaller: Record<string, Record<string, number[]>> = {};
    const byHook: Record<string, Record<string, number[]>> = {};

    for (const record of records) {
        const { at, target } = record;
        if (!at || !target || at < since) continue;
        const count = (counts[target] ??= { runs: 0, hits: 0 });
        count.runs += 1;
        if (record.cache === "hit") count.hits += 1;

        const ms = Number(record.ms);
        if (record.cache !== "miss" || !record.ms || Number.isNaN(ms)) continue;
        push(misses, target, ms);
        pushUnder(byCaller, target, record.caller || HUMAN, ms);
        pushUnder(byHook, target, record.hook || "none", ms);
    }

    return Object.fromEntries(
        Object.entries(counts)
            .sort(([, a], [, b]) => b.runs - a.runs)
            .map(([target, count]) => [
                target,
                {
                    ...count,
                    misses: durationsOf(misses[target] ?? []),
                    byCaller: durationsBy(byCaller[target] ?? {}),
                    byHook: durationsBy(byHook[target] ?? {}),
                },
            ]),
    );
};
