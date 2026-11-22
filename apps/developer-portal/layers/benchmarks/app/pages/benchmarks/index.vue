<template>
    <UDashboardPanel id="benchmarks">
        <template #header>
            <PageHeader :title="$t('benchmarks.title')">
                <template #actions>
                    <UButton
                        to="/wiki/docs/benchmarks/readme"
                        :label="$t('benchmarks.guide')"
                        icon="i-lucide-ruler"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                    />
                </template>
                <template v-if="benchmarks.length > 0" #intro>
                    <BenchmarksFacts :benchmarks />
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
                <p class="max-w-3xl text-sm text-muted">{{ $t("benchmarks.intro") }}</p>

                <CollectionEmpty
                    v-if="benchmarks.length === 0"
                    icon="i-lucide-bookmark"
                    folder="docs/benchmarks/"
                    skill="benchmark"
                    :each="$t('benchmarks.empty.each')"
                    :collected="false"
                />

                <template v-else>
                    <EmptyState v-if="visible.length === 0">
                        {{ $t("benchmarks.noMatch") }}
                    </EmptyState>
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
