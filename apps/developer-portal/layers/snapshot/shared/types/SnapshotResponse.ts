import type { CoverageArtifact } from "./CoverageArtifact.ts";
import type { DepsArtifact } from "./DepsArtifact.ts";
import type { DocsArtifact } from "./DocsArtifact.ts";
import type { Manifest } from "./Manifest.ts";
import type { MetricsArtifact } from "./MetricsArtifact.ts";
import type { ProjectsArtifact } from "./ProjectsArtifact.ts";
import type { UsageArtifact } from "./UsageArtifact.ts";

export interface SnapshotResponse {
    manifest: Manifest | null;
    projects?: ProjectsArtifact | null;
    coverage?: CoverageArtifact | null;
    metrics?: MetricsArtifact | null;
    deps?: DepsArtifact | null;
    docs?: DocsArtifact | null;
    usage?: UsageArtifact | null;
}
