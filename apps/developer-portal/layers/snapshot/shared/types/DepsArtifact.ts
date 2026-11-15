import type { OutdatedPackage } from "./OutdatedPackage.ts";
import type { VulnerabilityAdvisory } from "./VulnerabilityAdvisory.ts";

export interface DepsArtifact {
    generatedAt: string;
    /** Null when `pnpm audit` itself failed to run — distinct from every count being 0. */
    vulnerabilities: {
        info: number;
        low: number;
        moderate: number;
        high: number;
        critical: number;
    } | null;
    /** Null alongside `vulnerabilities` — same collection failure, not a separate one. */
    totalDependencies: number | null;
    advisories: VulnerabilityAdvisory[];
    /** Null when `pnpm outdated` itself failed to run — distinct from an empty array, which means nothing is outdated. */
    outdated: OutdatedPackage[] | null;
}
