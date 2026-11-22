export const COVERAGE_METRICS = ["lines", "statements", "functions", "branches"] as const;

export type CoverageMetricName = (typeof COVERAGE_METRICS)[number];

/** One table cell: the percentage as a meter width, a label and its tone class. */
export const coverageCell = (key: CoverageMetricName, pct: number | null | undefined) => ({
    key,
    pct: pct ?? 0,
    label: dash(pct, "%"),
    tone: toneClass(coverageTone(pct ?? null)),
});
