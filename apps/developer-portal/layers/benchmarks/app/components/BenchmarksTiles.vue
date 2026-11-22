<template>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
            label="Sites"
            :value="benchmarks.length"
            hint="one file per site"
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
import { countByVerdict } from "#layers/benchmarks/shared/benchmarks.ts";
import type { Benchmark } from "#layers/benchmarks/shared/types/Benchmark.ts";
import type { BenchmarkVerdict } from "#layers/benchmarks/shared/types/BenchmarkVerdict.ts";

interface Props {
    benchmarks: Benchmark[];
}

const { benchmarks } = defineProps<Props>();

const TILES: { verdict: BenchmarkVerdict; hint: string }[] = [
    { verdict: "strong", hint: "worth studying whole" },
    { verdict: "partial", hint: "one or two ideas to take" },
    { verdict: "avoid", hint: "kept as what not to do" },
];

const counts = computed(() => countByVerdict(benchmarks));

const tiles = computed(() =>
    TILES.map(({ verdict, hint }) => ({
        verdict,
        hint,
        label: benchmarkVerdictLabel(verdict),
        value: counts.value[verdict],
        tone: benchmarkVerdictTone(verdict),
    })),
);
</script>
