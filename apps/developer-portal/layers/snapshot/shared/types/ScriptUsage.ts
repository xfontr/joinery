import type { DayUsage } from "./DayUsage.ts";
import type { Durations } from "./Durations.ts";

/** One script's runs, summed from the rows in `data/telemetry/scripts/*.csv`. */
export interface ScriptUsage {
    runs: number;
    /** Runs inside the last `UsageArtifact.windowDays`, so a script busy a year ago doesn't read as busy. */
    recent: number;
    /** Refusals, usage errors and crashes; a `--check` that found something is not one. */
    failures: number;
    /** Runs with no terminal: piped, or run by an agent. */
    headless: number;
    totalMs: number;
    first: string;
    last: string;
    /** `human`, or the agent's name, e.g. `claude-code`. */
    callers: Record<string, number>;
    commands: Record<string, number>;
    /** Projects named on the command line, e.g. `pnpm dev huella-legal`. */
    targets: Record<string, number>;
    /** The `<area>` segment of the branch each run happened on, or `repo`. */
    areas: Record<string, number>;
    flags: Record<string, number>;
    /** `ok`, `finding`, `refused`, `usage`, `crash`, `cancelled` or `interrupted`. */
    outcomes?: Record<string, number>;
    /** A crash's kind, e.g. `gh:exit`; never its message. */
    errors?: Record<string, number>;
    /** Timed runs inside the window, Ctrl+C and cancels left out; `null` when there are none. */
    durations?: Durations | null;
    commandDurations?: Record<string, Durations>;
    /**
     * Keyed by `YYYY-MM-DD`, holding only days inside the window that had a run. Missing from a
     * snapshot collected before per-day counts were kept.
     */
    days?: Record<string, DayUsage>;
}
