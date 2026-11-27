import type { PageFact } from "~/types/PageFact";

const SEVERITIES = ["critical", "high", "moderate", "low"] as const;

/** The dependency snapshot and the header facts drawn from it. */
export const useDepsPage = () => {
    const { t } = useI18n();
    const deps = depsArtifact();
    const counts = deps?.vulnerabilities ?? null;
    const outdated = deps?.outdated ?? null;

    const provenance = t("deps.provenance");

    const facts: PageFact[] = [
        ...SEVERITIES.map((severity) => ({
            label: t(`common.severity.${severity}`),
            value: counts ? String(counts[severity]) : "—",
            class: counts?.[severity] ? toneClass(severityTone(severity)) : "",
        })),
        { label: t("deps.facts.outdated"), value: outdated ? String(outdated.length) : "—" },
        { label: t("deps.facts.dependencies"), value: String(deps?.totalDependencies ?? "—") },
    ];

    return { deps, provenance, facts };
};
