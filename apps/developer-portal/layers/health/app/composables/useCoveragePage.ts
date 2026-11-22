import type { PageFact } from "~/types/PageFact";

/** The coverage snapshot and the header facts drawn from it. */
export const useCoveragePage = () => {
    const coverage = coverageArtifact();
    const projects = coverage?.projects ?? [];
    const collected = projects.filter((project) => project.collected).length;

    const provenance = `Vitest coverage · ${collected} of ${projects.length} projects · collected ${relativeTime(coverage?.generatedAt)}`;

    const facts = COVERAGE_METRICS.map((key): PageFact => ({
        label: key,
        value: dash(coverage?.totals?.[key], "%"),
        class: toneClass(coverageTone(coverage?.totals?.[key] ?? null)),
    }));

    return { coverage, projects, provenance, facts };
};
