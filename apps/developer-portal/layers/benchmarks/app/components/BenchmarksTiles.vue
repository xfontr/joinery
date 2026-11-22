<template>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
            :label="$t('benchmarksTiles.sites')"
            :value="benchmarks.length"
            :hint="$t('benchmarksTiles.sitesHint')"
            icon="i-lucide-bookmark"
        />
        <StatTile
            v-for="tile in tiles"
            :key="tile.verdict"
            :label="tile.label"
            :value="tile.value"
            :hint="tile.hint"
            :tone="tile.tone"
        />
    </div>
</template>

<script setup lang="ts">
import { countByVerdict } from "#layers/benchmarks/app/utils/benchmarks.ts";
import type { Benchmark } from "#layers/benchmarks/app/types/Benchmark.ts";
import type { BenchmarkVerdict } from "#layers/benchmarks/app/types/BenchmarkVerdict.ts";

interface Props {
    benchmarks: Benchmark[];
}

const { benchmarks } = defineProps<Props>();

const TILES: BenchmarkVerdict[] = ["strong", "partial", "avoid"];

const { t } = useI18n();

const counts = computed(() => countByVerdict(benchmarks));

const tiles = computed(() =>
    TILES.map((verdict) => ({
        verdict,
        hint: t(`benchmarksTiles.hints.${verdict}`),
        label: t(`benchmarks.verdict.${verdict}`),
        value: counts.value[verdict],
        tone: benchmarkVerdictTone(verdict),
    })),
);
</script>
