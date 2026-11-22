import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";

const [artifact = null] = Object.values(
    import.meta.glob<UsageArtifact>("~~/.report/usage.json", { eager: true, import: "default" }),
);

/** The collected usage artifact, bundled at build time; null when `.report/` has none. */
export const usageArtifact = (): UsageArtifact | null => artifact;
