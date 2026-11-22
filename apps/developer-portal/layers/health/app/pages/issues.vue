<template>
    <UDashboardPanel id="issues">
        <template #header>
            <PageHeader :title="$t('issues.title')">
                <template #actions>
                    <HealthIssuesRead
                        :fetched-at="issues.fetchedAt"
                        :reloading
                        @refresh="refresh"
                    />
                </template>
            </PageHeader>

            <HealthIssuesToolbar v-model:search="search" v-model:label="label" :issues="all" />
        </template>

        <template #body>
            <div class="flex flex-col gap-4">
                <p class="max-w-3xl text-sm text-muted">{{ $t("issues.intro") }}</p>

                <UAlert
                    v-if="issues.error"
                    color="warning"
                    variant="subtle"
                    icon="i-lucide-plug-zap"
                    :title="$t('issues.error.title')"
                    :description="$t('issues.error.description', { error: issues.error })"
                />

                <ListCard
                    :title="$t('issues.list.title')"
                    :note="$t('issues.list.note')"
                    :shown="visible.length"
                    :total="all.length"
                >
                    <template #empty>
                        <div class="p-12 text-center">
                            <UIcon
                                name="i-lucide-circle-dot"
                                class="mx-auto mb-2 size-8 text-dimmed"
                            />
                            <p class="text-sm text-muted">
                                {{ all.length === 0 ? $t("issues.empty") : $t("issues.noMatch") }}
                            </p>
                            <I18nT
                                v-if="all.length === 0 && !issues.error"
                                keypath="issues.file"
                                tag="p"
                                scope="global"
                                class="mt-1 text-xs text-dimmed"
                            >
                                <template #command>
                                    <code class="font-mono">{{ ADD }}</code>
                                </template>
                            </I18nT>
                        </div>
                    </template>
                    <HealthIssueRow v-for="issue in visible" :key="issue.number" :issue />
                </ListCard>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const ADD = "pnpm issue:add";

const { issues, label, search, all, visible, reloading, refresh } = useIssueList();
</script>
