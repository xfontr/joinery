<template>
    <UDashboardPanel id="changelog">
        <template #header>
            <PageHeader title="What's new">
                <template #actions>
                    <span class="text-xs text-muted">
                        {{ sinceRelease ?? "—" }} commits since the last release
                    </span>
                </template>
            </PageHeader>
        </template>

        <template #body>
            <div class="flex flex-col gap-4">
                <p class="max-w-3xl text-sm text-muted">
                    This page brings together generated release histories and unreleased activity
                    across the workspace.
                </p>

                <div v-if="changelogs.length === 0" class="p-12 text-center">
                    <UIcon name="i-lucide-tag" class="mx-auto mb-2 size-8 text-dimmed" />
                    <p class="text-sm text-muted">No CHANGELOG.md in the workspace yet.</p>
                    <p class="mt-1 text-xs text-dimmed">
                        They are written by <code class="font-mono">nx release</code>, never by
                        hand.
                    </p>
                </div>

                <div v-else class="grid gap-4 lg:grid-cols-4">
                    <div class="flex flex-col gap-3">
                        <ChangelogList v-model="selected" :changelogs :projects />
                        <ChangelogNotes :projects :conventional />
                    </div>

                    <UCard class="lg:col-span-3">
                        <ContentRenderer v-if="page" :value="page" />
                    </UCard>
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { changelogs, selected, page, projects, sinceRelease, conventional, ready } = useChangelogs();

await ready;
</script>
