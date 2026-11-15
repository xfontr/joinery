import type { REVIEW_GATES } from "../constants.ts";

/** Which pending articles must reach `bulkApplyMinLevel` before bulk apply. */
export type ReviewGate = (typeof REVIEW_GATES)[number];
