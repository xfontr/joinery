<template>
    <UDashboardToolbar>
        <template #left>
            <UInput
                v-model="search"
                icon="i-lucide-search"
                :placeholder="$t('decisionsToolbar.search')"
                size="sm"
                class="w-56"
            />
            <USelect v-model="status" :items="STATUSES" value-key="value" size="sm" class="w-40" />
            <USelect
                v-model="decision"
                :items="OUTCOMES"
                value-key="value"
                size="sm"
                class="w-40"
            />
        </template>
        <template #right>
            <USelect v-model="sort" :items="sortItems" value-key="value" size="sm" class="w-44" />
        </template>
    </UDashboardToolbar>
</template>

<script setup lang="ts">
import type { DecisionSort } from "#layers/decisions/shared/decisionReports.ts";
import {
    DECISION_OUTCOMES,
    DECISION_STATUSES,
    type DecisionOutcome,
    type DecisionStatus,
} from "#layers/snapshot/shared/decisions.ts";

const search = defineModel<string>("search", { required: true });
const status = defineModel<DecisionStatus | "all">("status", { required: true });
const decision = defineModel<DecisionOutcome | "all">("decision", { required: true });
const sort = defineModel<DecisionSort>("sort", { required: true });

const SORTS: DecisionSort[] = ["newest", "oldest", "updated", "status"];

const { t } = useI18n();

const STATUSES = [
    { label: t("decisionsToolbar.everyStatus"), value: "all" },
    ...DECISION_STATUSES.map((value) => ({ label: t(`decisions.status.${value}`), value })),
];

const OUTCOMES = [
    { label: t("decisionsToolbar.everyDecision"), value: "all" },
    ...DECISION_OUTCOMES.map((value) => ({ label: t(`decisions.outcome.${value}`), value })),
];

const sortItems = SORTS.map((value) => ({ label: t(`decisionsToolbar.sorts.${value}`), value }));
</script>
