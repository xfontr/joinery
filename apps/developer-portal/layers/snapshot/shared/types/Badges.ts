import type { VulnerabilityAdvisory } from "./VulnerabilityAdvisory.ts";

export interface Badges {
    advisories: number;
    /** Null both when nothing is vulnerable and when `pnpm audit` never ran. */
    worstSeverity: VulnerabilityAdvisory["severity"] | null;
    lineCoverage: number | null;
    docPages: number | null;
    brokenLinks: number;
    collected: { branch: string; commit: string; at: string } | null;
}
