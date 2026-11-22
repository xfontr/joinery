import type { BenchmarkVerdict } from "#layers/benchmarks/app/types/BenchmarkVerdict.ts";
import { BENCHMARK_VERDICT_LABELS } from "#layers/benchmarks/app/utils/benchmarks.ts";
import type { Tone } from "~/types/Tone";

export const benchmarkVerdictLabel = (verdict: BenchmarkVerdict): string =>
    BENCHMARK_VERDICT_LABELS[verdict];

const VERDICT_TONES = {
    strong: "good",
    partial: "neutral",
    avoid: "bad",
} as const satisfies Record<BenchmarkVerdict, Tone>;

export const benchmarkVerdictTone = (verdict: BenchmarkVerdict): Tone => VERDICT_TONES[verdict];

/** `design-system` reads as `design system`. */
export const benchmarkKindLabel = (kind: string): string => kind.replaceAll("-", " ");
