/** One project as the catalog table shows it. */
export interface ProjectRow {
    name: string;
    root: string;
    to: string;
    /** The top-level folder: `apps`, `packages` or `infrastructure`. */
    kind: string;
    description: string;
    version: string | null;
    unreleased: number;
    recent: number | null;
    specs: number | null;
    lines: number | null;
    linesLabel: string;
    tone: string;
    usedBy: number;
    /** Version, unreleased count and dependents in one line, for the narrow layout. */
    compact: string;
}
