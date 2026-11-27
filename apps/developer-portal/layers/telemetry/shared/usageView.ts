import type { DayUsage } from "#layers/snapshot/shared/types/DayUsage.ts";
import type { Durations } from "#layers/snapshot/shared/types/Durations.ts";
import type { LintUsage } from "#layers/snapshot/shared/types/LintUsage.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import { FOUGHT_DISABLES, NOISY_SHARE } from "./lintUsage.ts";
import { FAILING_RATE, MIN_RUNS, windowStart } from "./usage.ts";

const DAY_MS = 24 * 60 * 60 * 1000;

const EMPTY_DAY: DayUsage = { runs: 0, agent: 0, failures: 0, known: 0 };

interface ScriptRow extends DayUsage {
    name: string;
    /** One entry per `windowDays` day, in the same order. */
    days: DayUsage[];
    /** `null` for a script folder with no recorded run. */
    last: string | null;
    failing: boolean;
}

interface RuleRow {
    rule: string;
    hits: number;
    fixable: number;
    disabled: number;
    /** Hits per project, in the order of `LintTable.projects`. */
    projects: number[];
}

interface LintTable {
    /** Busiest first. */
    projects: string[];
    rows: RuleRow[];
}

const nextDay = (day: string): string =>
    new Date(Date.parse(`${day}T00:00:00Z`) + DAY_MS).toISOString().slice(0, 10);

/** Every day from the window's first through the snapshot's, so a day with no run still gets a cell. */
export const windowDays = (generatedAt: string): string[] => {
    const days: string[] = [];
    const last = generatedAt.slice(0, 10);
    for (let day = windowStart(generatedAt); day <= last; day = nextDay(day)) days.push(day);

    return days;
};

/** The fewest days a strip shows, so a log a day old still reads as a timeline. */
const MIN_SHOWN_DAYS = 14;

/** The window's days from the first with a run, so a young log isn't drawn as months of nothing. */
export const shownDays = ({
    generatedAt,
    scripts,
}: Pick<UsageArtifact, "generatedAt" | "scripts">): string[] => {
    const days = windowDays(generatedAt);
    const first = Object.values(scripts)
        .flatMap((usage) => Object.keys(usage.days ?? {}))
        .sort((a, b) => a.localeCompare(b))[0];
    const from = first ? Math.max(0, days.indexOf(first)) : 0;

    return days.slice(Math.max(0, Math.min(from, days.length - MIN_SHOWN_DAYS)));
};

export const sumDays = (days: DayUsage[]): DayUsage =>
    days.reduce(
        (total, day) => ({
            runs: total.runs + day.runs,
            agent: total.agent + day.agent,
            failures: total.failures + day.failures,
            known: total.known + day.known,
        }),
        EMPTY_DAY,
    );

/** Failures over the runs whose outcome is known, or `null` when none is. */
const failureRate = ({ failures, known }: DayUsage): number | null =>
    known === 0 ? null : failures / known;

export const isFailing = (day: DayUsage): boolean =>
    day.known >= MIN_RUNS && (failureRate(day) ?? 0) >= FAILING_RATE;

/** Every known script and every recorded one, busiest in the window first. */
export const scriptRows = ({
    generatedAt,
    known,
    scripts,
}: Omit<UsageArtifact, "lint">): ScriptRow[] => {
    const days = shownDays({ generatedAt, scripts });
    const names = [...new Set([...known, ...Object.keys(scripts)])];

    return names
        .map((name) => {
            const usage = scripts[name];
            const daily = days.map((day) => usage?.days?.[day] ?? EMPTY_DAY);
            // A snapshot collected before per-day counts still knows how many runs fell in the window.
            const total =
                usage && !usage.days ? { ...EMPTY_DAY, runs: usage.recent } : sumDays(daily);

            return {
                name,
                days: daily,
                ...total,
                last: usage?.last ?? null,
                failing: isFailing(total),
            };
        })
        .sort(
            (a, b) =>
                b.runs - a.runs ||
                (b.last ?? "").localeCompare(a.last ?? "") ||
                a.name.localeCompare(b.name),
        );
};

/** Each window day summed across scripts. */
export const dailyTotals = (rows: ScriptRow[]): DayUsage[] =>
    (rows[0]?.days ?? []).map((_, index) =>
        sumDays(rows.map((row) => row.days[index] ?? EMPTY_DAY)),
    );

/** Rules that fired or are disabled inline, against every project any of them fired in. */
export const lintTable = (lint: LintUsage): LintTable => {
    const shown = Object.entries(lint.rules)
        .filter(([, usage]) => usage.recent > 0 || usage.disabled > 0)
        .sort(([, a], [, b]) => b.recent - a.recent || b.disabled - a.disabled);

    const totals: Record<string, number> = {};
    for (const [, usage] of shown)
        for (const [project, count] of Object.entries(usage.projects))
            totals[project] = (totals[project] ?? 0) + count;

    const projects = Object.keys(totals).sort(
        (a, b) => (totals[b] ?? 0) - (totals[a] ?? 0) || a.localeCompare(b),
    );

    return {
        projects,
        rows: shown.map(([rule, usage]) => ({
            rule,
            hits: usage.recent,
            fixable: usage.fixable,
            disabled: usage.disabled,
            projects: projects.map((project) => usage.projects[project] ?? 0),
        })),
    };
};

export type CallerMix = "agents" | "both" | "people";

export type FixKind = "manual" | "auto";

interface Tick {
    /** Percent along the axis. */
    at: number;
    label: string;
}

interface Axis {
    ticks: Tick[];
    /** Percent along the axis where the alert's threshold sits. */
    threshold: number;
}

interface Point<Kind extends string> {
    name: string;
    /** Percent from the left. */
    x: number;
    /** Percent from the bottom. */
    y: number;
    kind: Kind;
    /** The figures a tooltip names, beside the point's `name`. */
    detail: Record<string, number>;
    labelled: boolean;
}

export interface Quadrants<Kind extends string> {
    x: Axis;
    y: Axis;
    points: Point<Kind>[];
}

/** Keeps zero off the log scale's first decade, so a count of 1 isn't drawn on the axis. */
const ZERO_BAND = 8;

const decadesFor = (max: number): number => Math.max(1, Math.ceil(Math.log10(Math.max(10, max))));

/** Percent along a log axis of `decades` powers of ten; zero gets a lane of its own off the axis. */
const logAt = (value: number, decades: number): number =>
    value <= 0 ? ZERO_BAND / 2 : ZERO_BAND + ((100 - ZERO_BAND) * Math.log10(value)) / decades;

const logTicks = (decades: number): Tick[] => [
    { at: ZERO_BAND / 2, label: "0" },
    ...Array.from({ length: decades + 1 }, (_, power) => ({
        at: logAt(10 ** power, decades),
        label: String(10 ** power),
    })),
];

const linearTicks = (max: number, format: (value: number) => string): Tick[] =>
    [0, 0.25, 0.5, 0.75, 1].map((step) => ({ at: step * 100, label: format(step * max) }));

const callerMix = ({ runs, agent }: DayUsage): CallerMix => {
    if (agent === runs) return "agents";

    return agent === 0 ? "people" : "both";
};

/** Scripts run in the window: how often against how often they fail, on the alerts' thresholds. */
export const scriptQuadrants = (rows: ScriptRow[]): Quadrants<CallerMix> => {
    const plotted = rows.filter((row) => row.known > 0);
    const decades = decadesFor(Math.max(MIN_RUNS, ...plotted.map((row) => row.runs)));
    const topRate = Math.max(FAILING_RATE * 2, ...plotted.map((row) => failureRate(row) ?? 0));
    const yMax = Math.ceil(topRate * 10) / 10;

    return {
        x: { ticks: logTicks(decades), threshold: logAt(MIN_RUNS, decades) },
        y: {
            ticks: linearTicks(yMax, (value) => `${Math.round(value * 100)}%`),
            threshold: (FAILING_RATE / yMax) * 100,
        },
        points: plotted.map((row) => {
            const failed = failureRate(row) ?? 0;

            return {
                name: row.name,
                x: logAt(row.runs, decades),
                y: (failed / yMax) * 100,
                kind: callerMix(row),
                detail: { runs: row.runs, failed: Math.round(failed * 100), agent: row.agent },
                labelled: true,
            };
        }),
    };
};

/** How many labelled rules a quiet chart still names, so it never reads as anonymous dots. */
const NAMED_BUSIEST = 3;

/** Rules that fired in the window or are disabled inline: hits against `eslint-disable` comments. */
export const ruleQuadrants = (lint: LintUsage): Quadrants<FixKind> => {
    const rules = Object.entries(lint.rules);
    const recentTotal = rules.reduce((sum, [, usage]) => sum + usage.recent, 0);
    const noisyAt = NOISY_SHARE * recentTotal;
    const shown = rules
        .filter(([, usage]) => usage.recent > 0 || usage.disabled > 0)
        .sort(([, a], [, b]) => b.recent - a.recent || b.disabled - a.disabled);
    const decades = decadesFor(Math.max(noisyAt, ...shown.map(([, usage]) => usage.recent)));
    const topDisabled = Math.max(FOUGHT_DISABLES * 2, ...shown.map(([, usage]) => usage.disabled));
    const yMax = Math.ceil(topDisabled / 4) * 4;

    return {
        x: { ticks: logTicks(decades), threshold: logAt(Math.max(1, noisyAt), decades) },
        y: {
            ticks: linearTicks(yMax, (value) => String(Math.round(value))),
            threshold: (FOUGHT_DISABLES / yMax) * 100,
        },
        points: shown.map(([name, usage], index) => ({
            name,
            x: logAt(usage.recent, decades),
            y: (usage.disabled / yMax) * 100,
            kind: usage.recent > 0 && usage.fixable === usage.recent ? "auto" : "manual",
            detail: { hits: usage.recent, fixed: usage.fixable, disabled: usage.disabled },
            labelled:
                index < NAMED_BUSIEST ||
                usage.disabled >= FOUGHT_DISABLES ||
                (recentTotal > 0 && usage.recent >= noisyAt),
        })),
    };
};

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;

/** `820 ms`, `12.7 s`, `5.5 min`: one unit, so a column of times reads at a glance. */
export const formatMs = (ms: number): string => {
    if (ms < SECOND_MS) return `${Math.round(ms)} ms`;
    if (ms < MINUTE_MS) return `${(ms / SECOND_MS).toFixed(1)} s`;
    return `${(ms / MINUTE_MS).toFixed(1)} min`;
};

/** The `pnpm check` wall time sits on the `tasks` script's `check` subcommand. */
const CHECK_SCRIPT = "tasks";
const CHECK_COMMAND = "check";

export const checkDurations = ({ scripts }: Pick<UsageArtifact, "scripts">): Durations | null =>
    scripts[CHECK_SCRIPT]?.commandDurations?.[CHECK_COMMAND] ?? null;

export interface BuildTimeRow {
    /** A target, a CI step's command, or `check` for the whole of `pnpm check`. */
    name: string;
    kind: "check" | "target" | "step" | "job";
    durations: Durations | null;
    /** Median of the runs a pre-push hook started; `null` when none was timed. */
    prePushMs: number | null;
    /** Cache hits over runs; `null` where caching doesn't apply. */
    hitShare: number | null;
}

const PRE_PUSH = "pre-push";

/** Local rows: `pnpm check` whole, then each Nx target, slowest first. */
export const localBuildTimes = (
    usage: Pick<UsageArtifact, "scripts" | "tasks">,
): BuildTimeRow[] => {
    const check = checkDurations(usage);
    const targets = Object.entries(usage.tasks ?? {})
        .map(([name, task]): BuildTimeRow => ({
            name,
            kind: "target",
            durations: task.misses,
            prePushMs: task.byHook[PRE_PUSH]?.medianMs ?? null,
            hitShare: task.runs ? task.hits / task.runs : null,
        }))
        .sort((a, b) => (b.durations?.medianMs ?? -1) - (a.durations?.medianMs ?? -1));

    const whole: BuildTimeRow[] = check
        ? [
              {
                  name: CHECK_COMMAND,
                  kind: "check",
                  durations: check,
                  prePushMs: null,
                  hitShare: null,
              },
          ]
        : [];

    return [...whole, ...targets];
};

/** CI rows: each step that runs a command, then each job's total, slowest first within each. */
export const ciBuildTimes = ({ ci }: Pick<UsageArtifact, "ci">): BuildTimeRow[] => {
    const rows = (entries: Record<string, Durations>, kind: "step" | "job"): BuildTimeRow[] =>
        Object.entries(entries)
            .map(([name, durations]) => ({
                name,
                kind,
                durations,
                prePushMs: null,
                hitShare: null,
            }))
            .sort((a, b) => b.durations.medianMs - a.durations.medianMs);

    return ci ? [...rows(ci.steps, "step"), ...rows(ci.jobs, "job")] : [];
};

export interface FailureCauseRow {
    name: string;
    refused: number;
    usage: number;
    crash: number;
    /** A crash's kinds, most frequent first, e.g. `gh:exit ×3`. */
    crashes: string;
    /** Runs with no recorded outcome, from before outcomes were kept. */
    unknown: number;
}

/** Scripts with at least one refusal, usage error or crash, most failures first. */
export const failureCauseRows = ({ scripts }: Pick<UsageArtifact, "scripts">): FailureCauseRow[] =>
    Object.entries(scripts)
        .map(([name, usage]) => {
            const outcomes = usage.outcomes ?? {};
            const classified = Object.values(outcomes).reduce((sum, count) => sum + count, 0);

            return {
                name,
                refused: outcomes.refused ?? 0,
                usage: outcomes.usage ?? 0,
                crash: outcomes.crash ?? 0,
                crashes: Object.entries(usage.errors ?? {})
                    .map(([kind, count]) => `${kind} ×${count}`)
                    .join(" · "),
                unknown: usage.runs - classified,
            };
        })
        .filter((row) => row.refused + row.usage + row.crash > 0)
        .sort(
            (a, b) =>
                b.refused + b.usage + b.crash - (a.refused + a.usage + a.crash) ||
                a.name.localeCompare(b.name),
        );
