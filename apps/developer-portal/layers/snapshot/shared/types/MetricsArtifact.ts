import type { ProjectMetrics } from "./ProjectMetrics.ts";

export interface MetricsArtifact {
    generatedAt: string;
    commit: string;
    branch: string;
    projects: ProjectMetrics[];
    conventionalCommitRate: number | null;
    commitsSinceLastRelease: number | null;
}
