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
            <USelect
                v-model="status"
                :items="statusItems"
                value-key="value"
                size="sm"
                class="w-40"
            />
            <USelect
                v-model="decision"
                :items="outcomeItems"
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
import { DECISION_SORTS, type DecisionSort } from "#layers/decisions/shared/decisionReports.ts";
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

const { t } = useI18n();

const statusItems = computed(() =>
    filterItems(t("decisionsToolbar.everyStatus"), DECISION_STATUSES, (value) =>
        t(`decisions.status.${value}`),
    ),
);

const outcomeItems = computed(() =>
    filterItems(t("decisionsToolbar.everyDecision"), DECISION_OUTCOMES, (value) =>
        t(`decisions.outcome.${value}`),
    ),
);

const sortItems = computed(() =>
    DECISION_SORTS.map((value) => ({ label: t(`decisionsToolbar.sorts.${value}`), value })),
);
</script>
