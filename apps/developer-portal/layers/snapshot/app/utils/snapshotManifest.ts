import type { Manifest } from "#layers/snapshot/shared/types/Manifest.ts";

const [manifest = null] = Object.values(
    import.meta.glob<Manifest>("~~/.report/manifest.json", { eager: true, import: "default" }),
);

/** The last collect run's manifest, bundled at build time; null when `.report/` has none. */
export const snapshotManifest = (): Manifest | null => manifest;
