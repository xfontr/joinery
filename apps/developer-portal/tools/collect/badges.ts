import { worstSeverity } from "#layers/snapshot/shared/deps.ts";
import type { Badges } from "#layers/snapshot/shared/types/Badges.ts";
import type { CoverageArtifact } from "#layers/snapshot/shared/types/CoverageArtifact.ts";
import type { DepsArtifact } from "#layers/snapshot/shared/types/DepsArtifact.ts";
import type { DocsArtifact } from "#layers/snapshot/shared/types/DocsArtifact.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";

interface Collected {
    deps: DepsArtifact | null;
    coverage: CoverageArtifact | null;
    docs: DocsArtifact | null;
    metrics: MetricsArtifact | null;
}

/** The few figures the shell shows on every page, so no page's bundle carries a whole artifact. */
export const toBadges = ({ deps, coverage, docs, metrics }: Collected): Badges => ({
    advisories: deps?.advisories.length ?? 0,
    worstSeverity: worstSeverity(deps?.vulnerabilities),
    lineCoverage: coverage?.totals?.lines ?? null,
    docPages: docs?.pages.length ?? null,
    collected: metrics
        ? { branch: metrics.branch, commit: metrics.commit, at: metrics.generatedAt }
        : null,
});
