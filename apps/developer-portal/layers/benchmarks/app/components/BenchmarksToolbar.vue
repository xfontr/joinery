<template>
    <UDashboardToolbar>
        <template #left>
            <UInput
                v-model="search"
                icon="i-lucide-search"
                placeholder="Search site or verdict…"
                size="sm"
                class="w-56"
            />
            <USelect v-model="verdict" :items="VERDICTS" value-key="value" size="sm" class="w-44" />
            <USelect v-model="kind" :items="kindItems" value-key="value" size="sm" class="w-40" />
        </template>
    </UDashboardToolbar>
</template>

<script setup lang="ts">
import { BENCHMARK_VERDICTS } from "#layers/benchmarks/shared/benchmarks.ts";
import type { BenchmarkVerdict } from "#layers/benchmarks/shared/types/BenchmarkVerdict.ts";

interface Props {
    /** Every kind of site in the library, to filter by. */
    kinds: string[];
}

const { kinds } = defineProps<Props>();

const search = defineModel<string>("search", { required: true });
const verdict = defineModel<BenchmarkVerdict | "all">("verdict", { required: true });
const kind = defineModel<string>("kind", { required: true });

const VERDICTS = [
    { label: "Every verdict", value: "all" },
    ...BENCHMARK_VERDICTS.map((value) => ({ label: benchmarkVerdictLabel(value), value })),
];

const kindItems = computed(() => [
    { label: "Every kind", value: "all" },
    ...kinds.map((value) => ({ label: benchmarkKindLabel(value), value })),
]);
</script>
