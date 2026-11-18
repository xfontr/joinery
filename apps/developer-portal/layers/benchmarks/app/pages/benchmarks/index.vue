<template>
    <UDashboardPanel id="benchmarks">
        <template #header>
            <UDashboardNavbar title="Benchmarks">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <UButton
                        to="/wiki/docs/benchmarks/readme"
                        label="How an entry is written"
                        icon="i-lucide-ruler"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                    />
                </template>
            </UDashboardNavbar>

            <UDashboardToolbar>
                <template #left>
                    <UInput
                        v-model="search"
                        icon="i-lucide-search"
                        placeholder="Search site or verdict…"
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
                    <USelect
                        v-model="kind"
                        :items="kindItems"
                        value-key="value"
                        size="sm"
                        class="w-40"
                    />
                </template>
            </UDashboardToolbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-4">
                <p class="max-w-3xl text-sm text-muted">
                    Sites reviewed as design references, kept so the next redesign starts from what
                    has already been studied. Each entry is a verdict, a screenshot and a short
                    critique; what a project takes from them lives in its own decision report.
                </p>

                <div v-if="benchmarks.length === 0" class="p-12 text-center">
                    <UIcon name="i-lucide-bookmark" class="mx-auto mb-2 size-8 text-dimmed" />
                    <p class="text-sm text-muted">
                        Nothing under <code class="font-mono">docs/benchmarks/</code> yet.
                    </p>
                    <p class="mt-1 text-xs text-dimmed">
                        The <code class="font-mono">benchmark</code> skill writes one file per site.
                    </p>
                </div>

                <template v-else>
                    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <StatTile
                            label="Sites"
                            :value="benchmarks.length"
                            hint="one file per site"
                            icon="i-lucide-bookmark"
                        />
                        <StatTile
                            v-for="tile in verdictTiles"
                            :key="tile.verdict"
                            :label="benchmarkVerdictLabel(tile.verdict)"
                            :value="counts[tile.verdict]"
                            :hint="tile.hint"
                            :tone="benchmarkVerdictTone(tile.verdict)"
                        />
                    </div>

                    <div v-if="visible.length === 0" class="p-12 text-center text-sm text-muted">
                        Nothing matches that filter.
                    </div>

                    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <NuxtLink
                            v-for="benchmark in visible"
                            :key="benchmark.path"
                            :to="`/benchmarks/${benchmark.id}`"
                            class="flex flex-col overflow-hidden rounded-lg border border-default bg-default transition-colors hover:bg-elevated/50"
                        >
                            <img
                                :src="withBase(screenshotOf(benchmark))"
                                :alt="`${benchmark.title}, first screen`"
                                loading="lazy"
                                class="aspect-video w-full border-b border-default object-cover object-top"
                            />
                            <div class="flex flex-col gap-2 p-4">
                                <div class="flex items-center gap-2">
                                    <span class="flex-1 truncate font-medium">{{
                                        benchmark.title
                                    }}</span>
                                    <StatusPill
                                        v-if="benchmark.verdict"
                                        :label="benchmarkVerdictLabel(benchmark.verdict)"
                                        :tone="benchmarkVerdictTone(benchmark.verdict)"
                                    />
                                </div>
                                <span v-if="benchmark.kind" class="text-xs text-dimmed">{{
                                    benchmarkKindLabel(benchmark.kind)
                                }}</span>
                                <p class="line-clamp-3 text-sm text-muted">
                                    {{ benchmark.description }}
                                </p>
                            </div>
                        </NuxtLink>
                    </div>
                </template>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import type { BenchmarkVerdict } from "#layers/benchmarks/shared/types/BenchmarkVerdict.ts";
import {
    BENCHMARK_VERDICTS,
    countByVerdict,
    filterBenchmarks,
    kindsOf,
    screenshotOf,
} from "#layers/benchmarks/shared/benchmarks.ts";

const { data: benchmarks } = await useBenchmarks();

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

const counts = computed(() => countByVerdict(benchmarks.value));

const {
    app: { baseURL },
} = useRuntimeConfig();

const withBase = (path: string): string => `${baseURL.replace(/\/$/, "")}${path}`;

const verdictTiles: { verdict: BenchmarkVerdict; hint: string }[] = [
    { verdict: "strong", hint: "worth studying whole" },
    { verdict: "partial", hint: "one or two ideas to take" },
    { verdict: "avoid", hint: "kept as what not to do" },
];

const verdictItems = [
    { label: "Every verdict", value: "all" },
    ...BENCHMARK_VERDICTS.map((value) => ({ label: benchmarkVerdictLabel(value), value })),
];

const kindItems = computed(() => [
    { label: "Every kind", value: "all" },
    ...kindsOf(benchmarks.value).map((value) => ({ label: benchmarkKindLabel(value), value })),
]);
</script>
