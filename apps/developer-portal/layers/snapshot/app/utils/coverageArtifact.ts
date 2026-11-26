import type { CoverageArtifact } from "#layers/snapshot/shared/types/CoverageArtifact.ts";

const [artifact = null] = Object.values(
    import.meta.glob<CoverageArtifact>("~~/.report/coverage.json", {
        eager: true,
        import: "default",
    }),
);

/** The collected coverage artifact, bundled at build time; null when `.report/` has none. */
export const coverageArtifact = (): CoverageArtifact | null => artifact;
