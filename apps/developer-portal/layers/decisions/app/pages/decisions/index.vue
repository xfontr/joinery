<template>
    <UDashboardPanel id="decisions">
        <template #header>
            <PageHeader title="Decisions">
                <template #actions>
                    <UButton
                        to="/wiki/docs/decisions/readme"
                        label="How a report is written"
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
                <p class="max-w-3xl text-sm text-muted">
                    Decisions record why the repository works the way it does. Each report preserves
                    an architectural or product choice after its originating issue is finished, and
                    its status shows whether an accepted result has been implemented.
                </p>

                <CollectionEmpty
                    v-if="reports.length === 0"
                    icon="i-lucide-compass"
                    folder="docs/decisions/"
                    skill="decision-report"
                    each="them, one numbered file per decision"
                />

                <template v-else>
                    <DecisionsTiles :reports />
                    <ListCard
                        title="Every decision, as it was recorded"
                        note="The number is consecutive, not the issue's — a listing reads in the order the decisions were made. Status and decision come from each report's own frontmatter."
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
