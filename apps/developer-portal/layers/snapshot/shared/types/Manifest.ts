import type { ArtifactStatus } from "./ArtifactStatus.ts";

export interface Manifest {
    schemaVersion: number;
    generatedAt: string;
    commit: string;
    branch: string;
    artifacts: Record<string, ArtifactStatus>;
}
