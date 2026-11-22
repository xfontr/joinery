import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";

const [artifact = null] = Object.values(
    import.meta.glob<MetricsArtifact>("~~/.report/metrics.json", {
        eager: true,
        import: "default",
    }),
);

/** The collected metrics artifact, bundled at build time; null when `.report/` has none. */
export const metricsArtifact = (): MetricsArtifact | null => artifact;
