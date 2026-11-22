<template>
    <NuxtLink
        :to="`/benchmarks/${benchmark.id}`"
        class="flex flex-col overflow-hidden rounded-lg border border-default bg-default transition-colors hover:bg-elevated/50"
    >
        <img
            :src="screenshot"
            :alt="`${benchmark.title}, first screen`"
            loading="lazy"
            class="aspect-video w-full border-b border-default object-cover object-top"
        />
        <div class="flex flex-col gap-2 p-4">
            <div class="flex items-center gap-2">
                <span class="flex-1 truncate font-medium">{{ benchmark.title }}</span>
                <StatusPill v-if="verdict" :label="verdict.label" :tone="verdict.tone" />
            </div>
            <span v-if="kind" class="text-xs text-dimmed">{{ kind }}</span>
            <p class="line-clamp-3 text-sm text-muted">{{ benchmark.description }}</p>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import { screenshotOf } from "#layers/benchmarks/shared/benchmarks.ts";
import type { Benchmark } from "#layers/benchmarks/shared/types/Benchmark.ts";

interface Props {
    benchmark: Benchmark;
}

const { benchmark } = defineProps<Props>();

const screenshot = computed(() => embedUrl(screenshotOf(benchmark)));
const verdict = computed(() =>
    benchmark.verdict
        ? {
              label: benchmarkVerdictLabel(benchmark.verdict),
              tone: benchmarkVerdictTone(benchmark.verdict),
          }
        : null,
);
const kind = computed(() => (benchmark.kind ? benchmarkKindLabel(benchmark.kind) : null));
</script>
