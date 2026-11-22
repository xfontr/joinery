<template>
    <UDashboardPanel id="benchmarks">
        <template #header>
            <PageHeader title="Benchmarks">
                <template #actions>
                    <UButton
                        to="/wiki/docs/benchmarks/readme"
                        label="How an entry is written"
                        icon="i-lucide-ruler"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                    />
                </template>
            </PageHeader>

            <BenchmarksToolbar
                v-model:search="search"
                v-model:verdict="verdict"
                v-model:kind="kind"
                :kinds
            />
        </template>

        <template #body>
            <div class="flex flex-col gap-4">
                <p class="max-w-3xl text-sm text-muted">
                    Sites reviewed as design references, kept so the next redesign starts from what
                    has already been studied. Each entry is a verdict, a screenshot and a short
                    critique; what a project takes from them lives in its own decision report.
                </p>

                <CollectionEmpty
                    v-if="benchmarks.length === 0"
                    icon="i-lucide-bookmark"
                    folder="docs/benchmarks/"
                    skill="benchmark"
                    each="one file per site"
                    :collected="false"
                />

                <template v-else>
                    <BenchmarksTiles :benchmarks />
                    <EmptyState v-if="visible.length === 0"
                        >Nothing matches that filter.</EmptyState
                    >
                    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <BenchmarksCard
                            v-for="benchmark in visible"
                            :key="benchmark.path"
                            :benchmark
                        />
                    </div>
                </template>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { kindsOf } from "#layers/benchmarks/app/utils/benchmarks.ts";

const { benchmarks, verdict, kind, search, visible, ready } = useBenchmarkList();
const kinds = computed(() => kindsOf(benchmarks.value));

await ready;
</script>
