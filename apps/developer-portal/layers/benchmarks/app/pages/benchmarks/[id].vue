<template>
    <UDashboardPanel id="benchmark">
        <template #header>
            <UDashboardNavbar :title="benchmark?.title ?? page?.title ?? 'Not found'">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <StatusPill
                        v-if="verdictPill"
                        :label="verdictPill.label"
                        :tone="verdictPill.tone"
                    />
                    <span v-if="kindLabel" class="text-xs text-muted">{{ kindLabel }}</span>
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
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="flex min-w-0 flex-col gap-4">
                <UBreadcrumb :items="crumbs" />

                <UAlert
                    v-if="!page"
                    color="neutral"
                    variant="subtle"
                    icon="i-lucide-file-question"
                    title="No such benchmark"
                    :description="`Nothing under docs/benchmarks/ matches ${id}.`"
                />

                <template v-else>
                    <UPageBody class="mt-0 max-w-4xl">
                        <ContentRenderer :value="page" />
                    </UPageBody>

                    <USeparator class="my-4" />

                    <div class="grid gap-3 sm:grid-cols-2">
                        <NuxtLink
                            v-if="around.previous"
                            :to="`/benchmarks/${around.previous.id}`"
                            class="flex items-center gap-2 rounded-lg border border-default p-3 transition-colors hover:bg-elevated/50"
                        >
                            <UIcon name="i-lucide-arrow-left" class="size-4 text-dimmed" />
                            <div class="min-w-0">
                                <div class="text-xs text-dimmed">Previous</div>
                                <div class="truncate text-sm">{{ around.previous.title }}</div>
                            </div>
                        </NuxtLink>

                        <NuxtLink
                            v-if="around.next"
                            :to="`/benchmarks/${around.next.id}`"
                            class="flex items-center justify-end gap-2 rounded-lg border border-default p-3 transition-colors hover:bg-elevated/50 sm:col-start-2"
                        >
                            <div class="min-w-0 text-right">
                                <div class="text-xs text-dimmed">Next</div>
                                <div class="truncate text-sm">{{ around.next.title }}</div>
                            </div>
                            <UIcon name="i-lucide-arrow-right" class="size-4 text-dimmed" />
                        </NuxtLink>
                    </div>
                </template>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import { BENCHMARKS_PATH } from "#layers/benchmarks/shared/benchmarks.ts";

const route = useRoute();

const { data: benchmarks } = await useBenchmarks();

const id = computed(() => (route.params.id as string | undefined) ?? "");
const path = computed(() => `${BENCHMARKS_PATH}${id.value}`);

const { data: page } = await useAsyncData(
    () => `benchmark-${id.value}`,
    () => queryCollection("docs").path(path.value).first(),
    { watch: [path] },
);

if (!page.value) setResponseStatus(404);

const benchmark = computed(
    () => benchmarks.value.find((candidate) => candidate.id === id.value) ?? null,
);

const verdictPill = computed(
    () =>
        benchmark.value?.verdict && {
            label: benchmarkVerdictLabel(benchmark.value.verdict),
            tone: benchmarkVerdictTone(benchmark.value.verdict),
        },
);

const kindLabel = computed(() =>
    benchmark.value?.kind ? benchmarkKindLabel(benchmark.value.kind) : null,
);

const source = computed(() => `${path.value.slice(1)}.md`);

const crumbs = computed<BreadcrumbItem[]>(() => [
    { label: "Benchmarks", to: "/benchmarks", icon: "i-lucide-bookmark" },
    { label: benchmark.value?.title ?? id.value },
]);

/** Neighbours in gallery order, so reading on from one entry follows the page it was opened from. */
const around = computed(() => {
    const index = benchmarks.value.findIndex((candidate) => candidate.id === id.value);

    return {
        previous: index > 0 ? benchmarks.value[index - 1] : null,
        next: index === -1 ? null : (benchmarks.value[index + 1] ?? null),
    };
});
</script>
