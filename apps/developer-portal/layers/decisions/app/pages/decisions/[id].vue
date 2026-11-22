<template>
    <UDashboardPanel id="decision">
        <template #header>
            <PageHeader
                :crumbs="[{ label: $t('decision.crumb'), to: '/decisions' }]"
                :title="report?.title ?? page?.title ?? $t('decision.notFound')"
            >
                <template #actions>
                    <DecisionsMeta :report :source />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <div class="flex items-start gap-6">
                <div class="flex min-w-0 flex-1 flex-col gap-4">
                    <UBreadcrumb :items="crumbs" />

                    <UAlert
                        v-if="!page"
                        color="neutral"
                        variant="subtle"
                        icon="i-lucide-file-question"
                        :title="$t('decision.missing.title')"
                        :description="$t('decision.missing.description', { id })"
                    />

                    <template v-else>
                        <UPageBody class="mt-0">
                            <ContentRenderer :value="page" />
                        </UPageBody>

                        <USeparator class="my-4" />

                        <NeighbourLinks
                            v-bind="around"
                            :before="$t('decision.before')"
                            :after="$t('decision.after')"
                        />
                    </template>
                </div>

                <aside
                    v-if="page?.body?.toc?.links?.length"
                    class="sticky top-0 hidden w-56 shrink-0 xl:block"
                >
                    <UContentToc :links="page.body.toc.links" highlight class="bg-transparent" />
                </aside>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { id, page, report, source, crumbs, around, ready } = useDecisionPage();

await ready;

if (!page.value) setResponseStatus(404);
</script>
