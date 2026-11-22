<template>
    <UDashboardPanel id="audits">
        <template #header>
            <PageHeader :title="$t('audits.title')">
                <template #actions>
                    <UButton
                        to="/wiki/docs/audits/readme"
                        :label="$t('audits.guide')"
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
                <p class="max-w-3xl text-sm text-muted">{{ $t("audits.intro") }}</p>

                <CollectionEmpty
                    v-if="reports.length === 0"
                    icon="i-lucide-scan-search"
                    folder="docs/audits/"
                    skill="audit-report"
                    :each="$t('audits.empty.each')"
                />

                <template v-else>
                    <AuditsTiles :reports />
                    <ListCard
                        :title="$t('audits.list.title')"
                        :note="$t('audits.list.note')"
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
