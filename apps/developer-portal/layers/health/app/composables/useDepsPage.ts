import type { PageFact } from "~/types/PageFact";

const SEVERITIES = ["critical", "high", "moderate", "low"] as const;

/** The dependency snapshot and the header facts drawn from it; `ready` settles once it loads. */
export const useDepsPage = () => {
    const snapshot = useSnapshot("deps");
    const deps = computed(() => snapshot.data.value?.deps ?? null);

    const provenance = computed(
        () => `pnpm audit and pnpm outdated · collected ${relativeTime(deps.value?.generatedAt)}`,
    );

    const facts = computed((): PageFact[] => {
        const counts = deps.value?.vulnerabilities ?? null;
        const outdated = deps.value?.outdated ?? null;
        return [
            ...SEVERITIES.map((severity) => ({
                label: severity,
                value: counts ? String(counts[severity]) : "—",
                class: counts?.[severity] ? toneClass(severityTone(severity)) : "",
            })),
            { label: "Outdated", value: outdated ? String(outdated.length) : "—" },
            { label: "Dependencies", value: String(deps.value?.totalDependencies ?? "—") },
        ];
    });

    return { deps, provenance, facts, ready: snapshot };
};
