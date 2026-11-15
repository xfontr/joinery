import type { InvariantFinding } from "./InvariantFinding.ts";
import type { ProjectMetrics } from "./ProjectMetrics.ts";

export interface MetricsArtifact {
    generatedAt: string;
    commit: string;
    branch: string;
    projects: ProjectMetrics[];
    invariantFindings: InvariantFinding[];
    conventionalCommitRate: number | null;
    commitsSinceLastRelease: number | null;
}
