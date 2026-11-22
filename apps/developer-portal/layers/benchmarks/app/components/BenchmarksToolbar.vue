<template>
    <UDashboardToolbar>
        <template #left>
            <UInput
                v-model="search"
                icon="i-lucide-search"
                :placeholder="$t('benchmarksToolbar.search')"
                size="sm"
                class="w-56"
            />
            <USelect
                v-model="verdict"
                :items="verdictItems"
                value-key="value"
                size="sm"
                class="w-44"
            />
            <USelect v-model="kind" :items="kindItems" value-key="value" size="sm" class="w-40" />
        </template>
    </UDashboardToolbar>
</template>

<script setup lang="ts">
import { BENCHMARK_VERDICTS } from "#layers/benchmarks/app/utils/benchmarks.ts";
import type { BenchmarkVerdict } from "#layers/benchmarks/app/types/BenchmarkVerdict.ts";

interface Props {
    /** Every kind of site in the library, to filter by. */
    kinds: string[];
}

const { kinds } = defineProps<Props>();

const search = defineModel<string>("search", { required: true });
const verdict = defineModel<BenchmarkVerdict | "all">("verdict", { required: true });
const kind = defineModel<string>("kind", { required: true });

const { t } = useI18n();

const verdictItems = computed(() =>
    filterItems(t("benchmarksToolbar.everyVerdict"), BENCHMARK_VERDICTS, (value) =>
        t(`benchmarks.verdict.${value}`),
    ),
);

const kindItems = computed(() =>
    filterItems(t("benchmarksToolbar.everyKind"), kinds, benchmarkKindLabel),
);
</script>
