<template>
    <UDashboardPanel id="changelog">
        <template #header>
            <PageHeader :title="$t('changelog.title')">
                <template #actions>
                    <span class="text-xs text-muted">
                        {{ $t("changelog.sinceRelease", { count: sinceRelease ?? "—" }) }}
                    </span>
                </template>
            </PageHeader>
        </template>

        <template #body>
            <div class="flex flex-col gap-4">
                <p class="max-w-3xl text-sm text-muted">{{ $t("changelog.intro") }}</p>

                <div v-if="changelogs.length === 0" class="p-12 text-center">
                    <UIcon name="i-lucide-tag" class="mx-auto mb-2 size-8 text-dimmed" />
                    <p class="text-sm text-muted">{{ $t("changelog.empty.title") }}</p>
                    <I18nT
                        keypath="changelog.empty.hint"
                        tag="p"
                        scope="global"
                        class="mt-1 text-xs text-dimmed"
                    >
                        <template #command>
                            <code class="font-mono">{{ RELEASE }}</code>
                        </template>
                    </I18nT>
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
const RELEASE = "nx release";

const { changelogs, selected, page, projects, sinceRelease, conventional, ready } = useChangelogs();

await ready;
</script>
