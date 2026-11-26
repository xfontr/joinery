<template>
    <PageFacts :provenance="$t('benchmarksFacts.provenance')" :facts />
</template>

<script setup lang="ts">
import { BENCHMARK_VERDICTS, countByVerdict } from "#layers/benchmarks/app/utils/benchmarks.ts";
import type { Benchmark } from "#layers/benchmarks/app/types/Benchmark.ts";
import type { PageFact } from "~/types/PageFact";

interface Props {
    benchmarks: Benchmark[];
}

const { benchmarks } = defineProps<Props>();

const { t } = useI18n();

const counts = computed(() => countByVerdict(benchmarks));

const facts = computed((): PageFact[] => [
    { label: t("benchmarksFacts.sites"), value: String(benchmarks.length) },
    ...BENCHMARK_VERDICTS.map((verdict) => ({
        label: t(`benchmarks.verdict.${verdict}`),
        value: String(counts.value[verdict]),
        class: counts.value[verdict] ? toneClass(benchmarkVerdictTone(verdict)) : "",
    })),
]);
</script>
