import type { PageFact } from "~/types/PageFact";

/** The coverage snapshot and the header facts drawn from it; `ready` settles once it loads. */
export const useCoveragePage = () => {
    const snapshot = useSnapshot("coverage");
    const coverage = computed(() => snapshot.data.value?.coverage ?? null);
    const projects = computed(() => coverage.value?.projects ?? []);

    const provenance = computed(() => {
        const collected = projects.value.filter((project) => project.collected).length;
        return `Vitest coverage · ${collected} of ${projects.value.length} projects · collected ${relativeTime(coverage.value?.generatedAt)}`;
    });

    const facts = computed((): PageFact[] =>
        COVERAGE_METRICS.map((key) => ({
            label: key,
            value: dash(coverage.value?.totals?.[key], "%"),
            class: toneClass(coverageTone(coverage.value?.totals?.[key] ?? null)),
        })),
    );

    return { coverage, projects, provenance, facts, ready: snapshot };
};
