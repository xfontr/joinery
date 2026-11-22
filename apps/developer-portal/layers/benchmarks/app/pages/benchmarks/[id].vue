<template>
    <UDashboardPanel id="benchmark">
        <template #header>
            <PageHeader
                :crumbs="[{ label: 'benchmarks', to: '/benchmarks' }]"
                :title="benchmark?.title ?? page?.title ?? 'Not found'"
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
                    title="No such benchmark"
                    :description="`Nothing under docs/benchmarks/ matches ${id}.`"
                />

                <template v-else>
                    <UPageBody class="mt-0 max-w-4xl">
                        <ContentRenderer :value="page" />
                    </UPageBody>

                    <USeparator class="my-4" />

                    <NeighbourLinks v-bind="around" before="Previous" after="Next" />
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
