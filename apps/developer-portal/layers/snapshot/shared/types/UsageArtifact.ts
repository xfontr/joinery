import type { CiTimings } from "./CiTimings.ts";
import type { LintUsage } from "./LintUsage.ts";
import type { ScriptUsage } from "./ScriptUsage.ts";
import type { TaskUsage } from "./TaskUsage.ts";

export interface UsageArtifact {
    generatedAt: string;
    windowDays: number;
    /** Every script folder, so one that was never run can be told apart from one nobody listed. */
    known: string[];
    scripts: Record<string, ScriptUsage>;
    lint: LintUsage;
    /** Keyed by Nx target. Missing from a snapshot collected before tasks were timed. */
    tasks?: Record<string, TaskUsage>;
    /** `null` when GitHub couldn't be read: no `gh`, or not logged in. */
    ci?: CiTimings | null;
}
