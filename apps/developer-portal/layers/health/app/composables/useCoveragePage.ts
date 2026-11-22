import type { PageFact } from "~/types/PageFact";

/** The coverage snapshot and the header facts drawn from it. */
export const useCoveragePage = () => {
    const { t } = useI18n();
    const coverage = coverageArtifact();
    const projects = coverage?.projects ?? [];
    const collected = projects.filter((project) => project.collected).length;

    const provenance = t("coverage.provenance", {
        collected,
        total: projects.length,
        age: relativeTime(coverage?.generatedAt, t),
    });

    const facts = COVERAGE_METRICS.map((key): PageFact => ({
        label: t(`common.metrics.${key}`),
        value: dash(coverage?.totals?.[key], "%"),
        class: toneClass(coverageTone(coverage?.totals?.[key] ?? null)),
    }));

    return { coverage, projects, provenance, facts };
};
