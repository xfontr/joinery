import type { DecisionStatus } from "#layers/snapshot/shared/decisions.ts";
import type { Tone } from "~/types/Tone";

/** Reuses the same validated three-tone palette everything else on this page uses for a verdict. */
const DECISION_STATUS_TONES = {
    "to-implement": "warn",
    implemented: "good",
    "wont-implement": "neutral",
} as const satisfies Record<DecisionStatus, Tone>;

export const decisionStatusTone = (status: DecisionStatus): Tone => DECISION_STATUS_TONES[status];
