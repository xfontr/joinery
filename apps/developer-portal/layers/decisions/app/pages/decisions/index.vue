<template>
    <UDashboardPanel id="decisions">
        <template #header>
            <PageHeader :title="$t('decisions.title')">
                <template #actions>
                    <UButton
                        to="/wiki/docs/decisions/readme"
                        :label="$t('decisions.guide')"
                        icon="i-lucide-ruler"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                    />
                    <SnapshotAge :manifest artifact="docs" />
                </template>
            </PageHeader>

            <DecisionsToolbar
                v-model:search="search"
                v-model:status="status"
                v-model:decision="decision"
                v-model:sort="sort"
            />
        </template>

        <template #body>
            <div class="flex flex-col gap-4">
                <p class="max-w-3xl text-sm text-muted">{{ $t("decisions.intro") }}</p>

                <CollectionEmpty
                    v-if="reports.length === 0"
                    icon="i-lucide-compass"
                    folder="docs/decisions/"
                    skill="decision-report"
                    :each="$t('decisions.empty.each')"
                />

                <template v-else>
                    <DecisionsTiles :reports />
                    <ListCard
                        :title="$t('decisions.list.title')"
                        :note="$t('decisions.list.note')"
                        :shown="visible.length"
                        :total="reports.length"
                    >
                        <DecisionsRow v-for="report in visible" :key="report.path" :report />
                    </ListCard>
                </template>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { manifest, reports, status, decision, search, sort, visible } = useDecisionList();
</script>
