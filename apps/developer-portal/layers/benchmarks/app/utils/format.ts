import type { BenchmarkVerdict } from "#layers/benchmarks/app/types/BenchmarkVerdict.ts";
import type { Tone } from "~/types/Tone";

const VERDICT_TONES = {
    strong: "good",
    partial: "neutral",
    avoid: "bad",
} as const satisfies Record<BenchmarkVerdict, Tone>;

export const benchmarkVerdictTone = (verdict: BenchmarkVerdict): Tone => VERDICT_TONES[verdict];

/** `design-system` reads as `design system`. */
export const benchmarkKindLabel = (kind: string): string => kind.replaceAll("-", " ");
