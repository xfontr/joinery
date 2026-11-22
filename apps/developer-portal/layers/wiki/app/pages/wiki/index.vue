<template>
    <UDashboardPanel id="docs">
        <template #header>
            <PageHeader title="Wiki">
                <template #actions>
                    <span class="text-xs text-muted">{{ count }} pages, read in place</span>
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
                        <h1 class="text-xl font-semibold">The workspace, as it is written</h1>
                        <p class="mt-1 max-w-2xl text-sm text-muted">
                            Every markdown file in the repo, rendered from where it lives. The
                            README you edit for GitHub is the page you read here, so the two cannot
                            drift. Press
                            <UKbd value="meta" /><UKbd value="K" /> to search all of it.
                        </p>
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
