<template>
    <UDashboardPanel id="audits">
        <template #header>
            <PageHeader title="Audits">
                <template #actions>
                    <UButton
                        to="/wiki/docs/audits/readme"
                        label="How an audit is written"
                        icon="i-lucide-ruler"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                    />
                    <SnapshotAge :manifest artifact="docs" />
                </template>
            </PageHeader>

            <AuditsToolbar
                v-model:search="search"
                v-model:state="state"
                v-model:scope="scope"
                v-model:sort="sort"
                :scopes
            />
        </template>

        <template #body>
            <div class="flex flex-col gap-4">
                <p class="max-w-3xl text-sm text-muted">
                    Audits record what a static read of one project found wrong at one commit. Each
                    finding keeps its own status, so an audit is worked down over time rather than
                    fixed in one go.
                </p>

                <CollectionEmpty
                    v-if="reports.length === 0"
                    icon="i-lucide-scan-search"
                    folder="docs/audits/"
                    skill="audit-report"
                    each="them, one dated file per audit"
                />

                <template v-else>
                    <AuditsTiles :reports />
                    <ListCard
                        title="Every audit, and how much of it is left"
                        note="Progress counts fixed and won't-fix findings, read from each audit's own Status column."
                        :shown="visible.length"
                        :total="reports.length"
                    >
                        <AuditsRow v-for="report in visible" :key="report.path" :report />
                    </ListCard>
                </template>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { scopesOf } from "#layers/audits/shared/auditReports.ts";

const { manifest, reports, state, scope, search, sort, visible } = useAuditList();
const scopes = computed(() => scopesOf(reports.value));
</script>
