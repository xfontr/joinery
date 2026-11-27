import type { Durations } from "./Durations.ts";

/** One Nx target's runs inside the window, from `data/telemetry/tasks/*.csv`. */
export interface TaskUsage {
    /** Cache hits included. */
    runs: number;
    hits: number;
    /** Cache misses only: a hit's time is Nx restoring output, not doing the work. */
    misses: Durations | null;
    byCaller: Record<string, Durations>;
    /** Keyed by the git hook that ran it, or `none`. */
    byHook: Record<string, Durations>;
}
