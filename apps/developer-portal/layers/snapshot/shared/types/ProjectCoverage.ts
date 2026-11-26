import type { CoverageMetric } from "./CoverageMetric.ts";

export interface ProjectCoverage {
    name: string;
    root: string;
    /** False means no usable coverage report was found, which is distinct from 0%. */
    collected: boolean;
    files: number;
    lines?: CoverageMetric;
    statements?: CoverageMetric;
    functions?: CoverageMetric;
    branches?: CoverageMetric;
}
