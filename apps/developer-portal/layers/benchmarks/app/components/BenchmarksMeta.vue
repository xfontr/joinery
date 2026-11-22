<template>
    <StatusPill v-if="verdict" :label="verdict.label" :tone="verdict.tone" />
    <span v-if="kind" class="text-xs text-muted">{{ kind }}</span>
    <UButton
        v-if="benchmark?.url"
        :to="benchmark.url"
        label="Open site"
        icon="i-lucide-external-link"
        color="neutral"
        variant="ghost"
        size="xs"
        target="_blank"
        external
    />
    <code class="font-mono text-xs text-dimmed">{{ source }}</code>
</template>

<script setup lang="ts">
import type { Benchmark } from "#layers/benchmarks/app/types/Benchmark.ts";

interface Props {
    benchmark: Benchmark | null;
    /** The repo path of the entry's markdown file. */
    source: string;
}

const { benchmark, source } = defineProps<Props>();

const verdict = computed(() =>
    benchmark?.verdict
        ? {
              label: benchmarkVerdictLabel(benchmark.verdict),
              tone: benchmarkVerdictTone(benchmark.verdict),
          }
        : null,
);
const kind = computed(() => (benchmark?.kind ? benchmarkKindLabel(benchmark.kind) : null));
</script>
