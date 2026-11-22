<template>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
            :label="$t('benchmarksTiles.sites')"
            :value="benchmarks.length"
            :hint="$t('benchmarksTiles.sitesHint')"
            icon="i-lucide-bookmark"
        />
        <StatTile v-for="{ verdict, ...tile } in tiles" :key="verdict" v-bind="tile" />
    </div>
</template>

<script setup lang="ts">
import { BENCHMARK_VERDICTS, countByVerdict } from "#layers/benchmarks/app/utils/benchmarks.ts";
import type { Benchmark } from "#layers/benchmarks/app/types/Benchmark.ts";

interface Props {
    benchmarks: Benchmark[];
}

const { benchmarks } = defineProps<Props>();

const { t } = useI18n();

const counts = computed(() => countByVerdict(benchmarks));

const tiles = computed(() =>
    BENCHMARK_VERDICTS.map((verdict) => ({
        verdict,
        hint: t(`benchmarksTiles.hints.${verdict}`),
        label: t(`benchmarks.verdict.${verdict}`),
        value: counts.value[verdict],
        tone: benchmarkVerdictTone(verdict),
    })),
);
</script>
