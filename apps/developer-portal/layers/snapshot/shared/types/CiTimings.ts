import type { Durations } from "./Durations.ts";

/** Recent successful `ci.yml` runs, read from GitHub at collect time; nothing local runs e2e. */
export interface CiTimings {
    runs: number;
    jobs: Record<string, Durations>;
    /** Keyed by what the step runs, e.g. `nx test:e2e` or `pnpm unused:check`. */
    steps: Record<string, Durations>;
}
