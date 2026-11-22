import type { Badges } from "#layers/snapshot/shared/types/Badges.ts";

const [badges = null] = Object.values(
    import.meta.glob<Badges>("~~/.report/badges.json", { eager: true, import: "default" }),
);

/** The shell's figures from the last collect, bundled at build time; null when `.report/` has none. */
export const shellBadges = (): Badges | null => badges;
