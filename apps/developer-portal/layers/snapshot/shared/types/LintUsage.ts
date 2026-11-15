import type { LintRuleUsage } from "./LintRuleUsage.ts";

export interface LintUsage {
    /** The day of the oldest recorded hit, so "never fired" can be read against how long it's been watched. */
    since: string | null;
    rules: Record<string, LintRuleUsage>;
}
