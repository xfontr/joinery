<template>
    <UDashboardPanel id="doc">
        <template #header>
            <PageHeader
                :crumbs="[{ label: 'wiki', to: '/wiki' }]"
                :title="here?.entry.label ?? page?.title ?? 'Not found'"
            >
                <template #actions>
                    <DocSource :source :words="meta?.words" :updated-at="meta?.updatedAt" />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <!-- Each column scrolls on its own, so an unfolded nav never waits on the page beside it. -->
            <div class="flex min-h-0 flex-1 gap-6">
                <aside class="hidden w-60 shrink-0 overflow-y-auto lg:block">
                    <WikiNav :sections :current="path" />
                </aside>

                <div class="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto">
                    <UBreadcrumb :items="crumbs" />

                    <UAlert
                        v-if="!page"
                        color="neutral"
                        variant="subtle"
                        icon="i-lucide-file-question"
                        title="No such page"
                        :description="`Nothing in the workspace matches ${path}. The wiki links only to files that exist, so this is a hand-typed or stale URL.`"
                    />

                    <template v-else>
                        <UAlert
                            v-if="brokenLinks"
                            color="warning"
                            variant="subtle"
                            icon="i-lucide-link-2-off"
                            title="This page links to something that is not there"
                            :description="brokenLinks"
                            :ui="{ description: 'text-xs font-mono' }"
                        />
                        <UPageBody class="mt-0">
                            <ContentRenderer :value="page" />
                        </UPageBody>
                        <USeparator class="my-4" />
                        <NeighbourLinks v-bind="around" :before :after />
                    </template>
                </div>

                <WikiToc :links="page?.body?.toc?.links ?? []" />
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { path, sections, page, here, crumbs, around, meta, source, brokenLinks, ready } =
    useWikiPage();

const before = computed(() => `Previous in ${here.value?.group.label ?? ""}`);
const after = computed(() => `Next in ${here.value?.group.label ?? ""}`);

await ready;

if (!page.value) setResponseStatus(404);
</script>
