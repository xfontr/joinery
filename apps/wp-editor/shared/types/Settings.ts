import type { ReviewGate } from "./ReviewGate.ts";
import type { ReviewLevel } from "./ReviewLevel.ts";

export interface Settings {
    reviewGate: ReviewGate;
    bulkApplyMinLevel: Exclude<ReviewLevel, "unreviewed">;
    /** Bulk apply needs a clean dry run of exactly what it is about to write. */
    requireDryRun: boolean;
    /** Every WordPress write is refused; Apply and Bulk apply only check. */
    dryRun: boolean;
    /** Between articles in a bulk run, so a shared host's per-IP rate limit doesn't block us. */
    pauseMs: number;
}
