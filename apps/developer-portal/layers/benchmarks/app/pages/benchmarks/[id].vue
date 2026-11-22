<template>
    <UDashboardPanel id="benchmark">
        <template #header>
            <PageHeader
                :crumbs="[{ label: $t('benchmark.crumb'), to: '/benchmarks' }]"
                :title="benchmark?.title ?? page?.title ?? $t('benchmark.notFound')"
            >
                <template #actions>
                    <BenchmarksMeta :benchmark :source />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <div class="flex min-w-0 flex-col gap-4">
                <UBreadcrumb :items="crumbs" />

                <UAlert
                    v-if="!page"
                    color="neutral"
                    variant="subtle"
                    icon="i-lucide-file-question"
                    :title="$t('benchmark.missing.title')"
                    :description="$t('benchmark.missing.description', { id })"
                />

                <template v-else>
                    <UPageBody class="mt-0 max-w-4xl">
                        <ContentRenderer :value="page" />
                    </UPageBody>

                    <USeparator class="my-4" />

                    <NeighbourLinks
                        v-bind="around"
                        :before="$t('benchmark.previous')"
                        :after="$t('benchmark.next')"
                    />
                </template>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { id, page, benchmark, source, crumbs, around, ready } = useBenchmarkPage();

await ready;

if (!page.value) setResponseStatus(404);
</script>
