import type { ProjectsArtifact } from "#layers/snapshot/shared/types/ProjectsArtifact.ts";

const [artifact = null] = Object.values(
    import.meta.glob<ProjectsArtifact>("~~/.report/projects.json", {
        eager: true,
        import: "default",
    }),
);

/** The collected projects artifact, bundled at build time; null when `.report/` has none. */
export const projectsArtifact = (): ProjectsArtifact | null => artifact;
