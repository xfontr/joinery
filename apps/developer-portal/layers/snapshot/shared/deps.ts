import type { DepsArtifact } from "./types/DepsArtifact.ts";
import type { VulnerabilityAdvisory } from "./types/VulnerabilityAdvisory.ts";

const SEVERITIES = ["critical", "high", "moderate", "low", "info"] as const;

/** The most severe band with an advisory in it, so one figure can take that band's tone. */
export const worstSeverity = (
    counts: DepsArtifact["vulnerabilities"] | undefined,
): VulnerabilityAdvisory["severity"] | null =>
    counts ? (SEVERITIES.find((severity) => counts[severity] > 0) ?? null) : null;
