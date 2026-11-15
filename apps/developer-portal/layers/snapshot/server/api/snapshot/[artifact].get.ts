import { defineEventHandler, getRouterParam } from "h3";
import type { CoverageArtifact } from "../../../shared/types/CoverageArtifact.ts";
import type { DepsArtifact } from "../../../shared/types/DepsArtifact.ts";
import type { DocsArtifact } from "../../../shared/types/DocsArtifact.ts";
import type { Manifest } from "../../../shared/types/Manifest.ts";
import type { MetricsArtifact } from "../../../shared/types/MetricsArtifact.ts";
import type { ProjectsArtifact } from "../../../shared/types/ProjectsArtifact.ts";
import type { UsageArtifact } from "../../../shared/types/UsageArtifact.ts";
import type { SnapshotResponse } from "../../../shared/types/SnapshotResponse.ts";
import { readArtifact } from "../../utils/store.ts";

const readers = {
    projects: () => readArtifact<ProjectsArtifact>("projects"),
    coverage: () => readArtifact<CoverageArtifact>("coverage"),
    metrics: () => readArtifact<MetricsArtifact>("metrics"),
    deps: () => readArtifact<DepsArtifact>("deps"),
    docs: () => readArtifact<DocsArtifact>("docs"),
    usage: () => readArtifact<UsageArtifact>("usage"),
};

export default defineEventHandler(async (event): Promise<SnapshotResponse> => {
    const artifact = getRouterParam(event, "artifact");
    const manifest = await readArtifact<Manifest>("manifest");

    if (!artifact || !(artifact in readers)) return { manifest };

    const value = await readers[artifact as keyof typeof readers]();

    return { manifest, [artifact]: value };
});
