import type { AuditState, FindingStatus } from "#layers/snapshot/shared/audits.ts";
import type { Tone } from "~/types/Tone";

const FINDING_STATUS_TONES = {
    open: "warn",
    fixed: "good",
    "wont-fix": "neutral",
} as const satisfies Record<FindingStatus, Tone>;

export const findingStatusTone = (status: FindingStatus): Tone => FINDING_STATUS_TONES[status];

const AUDIT_STATE_TONES = {
    open: "warn",
    "in-progress": "warn",
    closed: "good",
} as const satisfies Record<AuditState, Tone>;

export const auditStateTone = (state: AuditState): Tone => AUDIT_STATE_TONES[state];
