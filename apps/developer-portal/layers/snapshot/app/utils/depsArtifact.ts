import type { DepsArtifact } from "#layers/snapshot/shared/types/DepsArtifact.ts";

const [artifact = null] = Object.values(
    import.meta.glob<DepsArtifact>("~~/.report/deps.json", { eager: true, import: "default" }),
);

/** The collected deps artifact, bundled at build time; null when `.report/` has none. */
export const depsArtifact = (): DepsArtifact | null => artifact;
