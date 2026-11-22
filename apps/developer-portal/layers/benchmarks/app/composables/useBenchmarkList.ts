import { filterBenchmarks } from "#layers/benchmarks/app/utils/benchmarks.ts";
import type { BenchmarkVerdict } from "#layers/benchmarks/app/types/BenchmarkVerdict.ts";

/** Every benchmark and the filtered slice the gallery shows; `ready` settles once they load. */
export const useBenchmarkList = () => {
    const read = useBenchmarks();
    const benchmarks = read.data;

    const verdict = ref<BenchmarkVerdict | "all">("all");
    const kind = ref("all");
    const search = ref("");

    const visible = computed(() =>
        filterBenchmarks(benchmarks.value, {
            verdict: verdict.value,
            kind: kind.value,
            search: search.value,
        }),
    );

    return { benchmarks, verdict, kind, search, visible, ready: read };
};
