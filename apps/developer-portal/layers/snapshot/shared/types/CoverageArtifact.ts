import type { ProjectCoverage } from "./ProjectCoverage.ts";

export interface CoverageArtifact {
    generatedAt: string;
    /** Weighted across collected projects only; null when nothing was collected. */
    totals: { lines: number; statements: number; functions: number; branches: number } | null;
    /** Whether the merged HTML report was copied into `public/coverage/`. */
    report: boolean;
    projects: ProjectCoverage[];
}
