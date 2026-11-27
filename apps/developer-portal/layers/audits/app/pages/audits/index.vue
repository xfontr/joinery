<template>
    <UDashboardPanel id="audits">
        <template #header>
            <PageHeader :title="$t('audits.title')">
                <template v-if="reports.length > 0" #facts>
                    <AuditsFacts :reports />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <div class="flex flex-col gap-4">
                <p class="max-w-3xl text-sm text-muted">
                    {{ $t("audits.intro") }}
                    <ULink to="/wiki/docs/audits/readme" class="text-default underline">{{
                        $t("audits.guide")
                    }}</ULink>
                </p>

                <CollectionEmpty
                    v-if="reports.length === 0"
                    icon="i-lucide-scan-search"
                    folder="docs/audits/"
                    skill="audit-report"
                    :each="$t('audits.empty.each')"
                />

                <template v-else>
                    <ListCard
                        :title="$t('audits.list.title')"
                        :note="$t('audits.list.note')"
                        :shown="visible.length"
                        :total="reports.length"
                    >
                        <template #filters>
                            <AuditsToolbar
                                v-model:search="search"
                                v-model:state="state"
                                v-model:scope="scope"
                                v-model:sort="sort"
                                :scopes
                            />
                        </template>
                        <AuditsRow v-for="report in visible" :key="report.path" :report />
                    </ListCard>
                </template>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { scopesOf } from "#layers/audits/shared/auditReports.ts";

const { reports, state, scope, search, sort, visible } = useAuditList();
const scopes = computed(() => scopesOf(reports.value));
</script>
