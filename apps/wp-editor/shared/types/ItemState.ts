import type { ReviewLevel } from "./ReviewLevel.ts";

export interface ItemState {
    level: ReviewLevel;
    rejected?: boolean;
    drift?: boolean;
    applied?: { at: string; modifiedGmt: string };
    restored?: { at: string; modifiedGmt: string };
}
