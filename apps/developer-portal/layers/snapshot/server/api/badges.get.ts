import { defineEventHandler } from "h3";
import type { Badges } from "../../shared/types/Badges.ts";
import type { CoverageArtifact } from "../../shared/types/CoverageArtifact.ts";
import type { DepsArtifact } from "../../shared/types/DepsArtifact.ts";
import type { DocsArtifact } from "../../shared/types/DocsArtifact.ts";
import type { MetricsArtifact } from "../../shared/types/MetricsArtifact.ts";
import { readArtifact } from "../utils/store.ts";

const SEVERITIES = ["critical", "high", "moderate", "low", "info"] as const;

/** The few figures the shell shows on every page, so no page's payload carries a whole artifact. */
export default defineEventHandler(async (): Promise<Badges> => {
    const [deps, coverage, docs, metrics] = await Promise.all([
        readArtifact<DepsArtifact>("deps"),
        readArtifact<CoverageArtifact>("coverage"),
        readArtifact<DocsArtifact>("docs"),
        readArtifact<MetricsArtifact>("metrics"),
    ]);

    const counts = deps?.vulnerabilities ?? null;

    return {
        advisories: deps?.advisories.length ?? 0,
        worstSeverity: counts
            ? (SEVERITIES.find((severity) => counts[severity] > 0) ?? null)
            : null,
        lineCoverage: coverage?.totals?.lines ?? null,
        docPages: docs?.pages.length ?? null,
        brokenLinks: docs?.brokenLinkCount ?? 0,
        collected: metrics
            ? { branch: metrics.branch, commit: metrics.commit, at: metrics.generatedAt }
            : null,
    };
});
