import type { BENCHMARK_VERDICTS } from "../utils/benchmarks.ts";

export type BenchmarkVerdict = (typeof BENCHMARK_VERDICTS)[number];
