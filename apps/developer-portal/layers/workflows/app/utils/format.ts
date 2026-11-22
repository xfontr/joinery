import type { CapabilityState, Kind, TicketStatus } from "#layers/workflows/shared/workflows.ts";
import type { Tone } from "~/types/Tone";

const CAPABILITY_TONES = {
    off: "neutral",
    skipped: "neutral",
    waits: "neutral",
    "can-file": "neutral",
    blocked: "neutral",
    "waiting-on-you": "warn",
    ready: "neutral",
    "in-flight": "warn",
    done: "good",
} as const satisfies Record<CapabilityState, Tone>;

export const capabilityStateTone = (state: CapabilityState): Tone => CAPABILITY_TONES[state];

/** One `--state-*` token per state in `workflows.css`, shared by blocks and tickets. */
export const stateColor = (state: CapabilityState | TicketStatus): string =>
    `var(--state-${state})`;

const BLOCK_ICONS = {
    build: null,
    spike: "i-lucide-flask-conical",
    owner: "i-lucide-user-round",
} as const satisfies Record<Kind, string | null>;

export const blockKindIcon = (kind: Kind): string | null => BLOCK_ICONS[kind];

/** How many `--stage-*` tokens `workflows.css` defines; a longer template wraps round. */
const STAGE_COLORS = 7;

export const stageColor = (index: number): string => `var(--stage-${(index % STAGE_COLORS) + 1})`;

export const capabilityColor = (state: CapabilityState): string => stateColor(state);

export const progressTone = (percent: number): Tone => {
    if (percent >= 100) return "good";
    if (percent >= 50) return "warn";

    return "neutral";
};
