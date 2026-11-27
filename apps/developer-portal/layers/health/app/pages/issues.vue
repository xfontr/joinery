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
                    <template #filters>
                        <HealthIssuesToolbar
                            v-model:search="search"
                            v-model:label="label"
                            :issues="all"
                        />
                    </template>
                    <template #empty>
                        <HealthIssuesEmpty :none="all.length === 0" :failed="!!issues.error" />
                    </template>
                    <HealthIssueRow v-for="issue in visible" :key="issue.number" :issue />
                </ListCard>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { issues, label, search, all, visible, reloading, refresh } = useIssueList();
</script>
