import type { LintUsage } from "./LintUsage.ts";
import type { ScriptUsage } from "./ScriptUsage.ts";

export interface UsageArtifact {
    generatedAt: string;
    windowDays: number;
    /** Every script folder, so one that was never run can be told apart from one nobody listed. */
    known: string[];
    scripts: Record<string, ScriptUsage>;
    lint: LintUsage;
}
