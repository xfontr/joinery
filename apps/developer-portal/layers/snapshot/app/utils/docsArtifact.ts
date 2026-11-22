import type { DocsArtifact } from "#layers/snapshot/shared/types/DocsArtifact.ts";

const [artifact = null] = Object.values(
    import.meta.glob<DocsArtifact>("~~/.report/docs.json", { eager: true, import: "default" }),
);

/** The collected docs artifact, bundled at build time; null when `.report/` has none. */
export const docsArtifact = (): DocsArtifact | null => artifact;
