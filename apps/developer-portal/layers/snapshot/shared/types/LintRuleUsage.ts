/** One ESLint rule, from `data/telemetry/lint/*.csv`. Only edits made by an agent are ever linted there. */
export interface LintRuleUsage {
    /** Switched on in at least one project's config. */
    enabled: boolean;
    /** Problems reported, counted again on every edit to a file that still has them. */
    hits: number;
    /** Hits inside the window; `fixable` and `projects` count only these. */
    recent: number;
    fixable: number;
    last: string | null;
    projects: Record<string, number>;
    /** `eslint-disable` comments naming it in the committed code. */
    disabled: number;
}
