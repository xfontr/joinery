import type { PageFact } from "~/types/PageFact";

const SEVERITIES = ["critical", "high", "moderate", "low"] as const;

/** The dependency snapshot and the header facts drawn from it. */
export const useDepsPage = () => {
    const deps = depsArtifact();
    const counts = deps?.vulnerabilities ?? null;
    const outdated = deps?.outdated ?? null;

    const provenance = `pnpm audit and pnpm outdated · collected ${relativeTime(deps?.generatedAt)}`;

    const facts: PageFact[] = [
        ...SEVERITIES.map((severity) => ({
            label: severity,
            value: counts ? String(counts[severity]) : "—",
            class: counts?.[severity] ? toneClass(severityTone(severity)) : "",
        })),
        { label: "Outdated", value: outdated ? String(outdated.length) : "—" },
        { label: "Dependencies", value: String(deps?.totalDependencies ?? "—") },
    ];

    return { deps, provenance, facts };
};
