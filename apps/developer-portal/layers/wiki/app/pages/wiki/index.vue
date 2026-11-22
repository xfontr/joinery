<template>
    <UDashboardPanel id="docs">
        <template #header>
            <PageHeader :title="$t('wiki.title')">
                <template #actions>
                    <span class="text-xs text-muted">{{ $t("wiki.count", { count }) }}</span>
                </template>
            </PageHeader>
        </template>

        <template #body>
            <!-- Each column scrolls on its own, so an unfolded nav never waits on the page beside it. -->
            <div class="flex min-h-0 flex-1 gap-6">
                <aside class="hidden w-60 shrink-0 overflow-y-auto lg:block">
                    <WikiNav :sections />
                </aside>

                <div class="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto *:shrink-0">
                    <div>
                        <h1 class="text-xl font-semibold">{{ $t("wiki.heading") }}</h1>
                        <I18nT
                            keypath="wiki.lead"
                            tag="p"
                            scope="global"
                            class="mt-1 max-w-2xl text-sm text-muted"
                        >
                            <template #keys><UKbd value="meta" /><UKbd value="K" /></template>
                        </I18nT>
                    </div>

                    <WikiStart :known />
                    <WikiBroken :pages />
                    <WikiRecent :pages :known />
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { sections, pages, count, known, ready } = useWikiHome();

await ready;
</script>
