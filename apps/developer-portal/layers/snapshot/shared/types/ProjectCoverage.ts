import type { CoverageMetric } from "./CoverageMetric.ts";

export interface ProjectCoverage {
    name: string;
    root: string;
    /**
     * False means no usable coverage report was found. Distinct from 0% — a project with no test
     * target and a project whose tests cover nothing are different facts, and averaging them
     * together is how a coverage number stops meaning anything.
     */
    collected: boolean;
    files: number;
    lines?: CoverageMetric;
    statements?: CoverageMetric;
    functions?: CoverageMetric;
    branches?: CoverageMetric;
}
