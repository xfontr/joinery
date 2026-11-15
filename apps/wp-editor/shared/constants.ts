import type { Settings } from "./types/Settings.ts";

export const POST_TYPES = ["posts", "pages"] as const;

export const REVIEW_LEVELS = ["unreviewed", "seen", "confirmed"] as const;

export const REVIEW_GATES = ["all", "requested", "none"] as const;

export const MAX_PAUSE_MS = 2000;

export const DEFAULT_SETTINGS: Settings = {
    reviewGate: "all",
    bulkApplyMinLevel: "confirmed",
    requireDryRun: false,
    dryRun: false,
    pauseMs: 500,
};
