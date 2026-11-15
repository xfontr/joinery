import type { ProjectNode } from "./ProjectNode.ts";
import type { RetiredProject } from "./RetiredProject.ts";

export interface ProjectsArtifact {
    generatedAt: string;
    projects: ProjectNode[];
    retired: RetiredProject[];
}
