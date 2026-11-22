<template>
    <UDashboardToolbar>
        <template #left>
            <UInput
                v-model="search"
                icon="i-lucide-search"
                placeholder="Search number or title…"
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
            <USelect v-model="sort" :items="SORTS" value-key="value" size="sm" class="w-44" />
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

const STATUSES = [
    { label: "Every status", value: "all" },
    ...DECISION_STATUSES.map((value) => ({ label: decisionStatusLabel(value), value })),
];

const OUTCOMES = [
    { label: "Every decision", value: "all" },
    ...DECISION_OUTCOMES.map((value) => ({ label: decisionOutcomeLabel(value), value })),
];

const SORTS: { label: string; value: DecisionSort }[] = [
    { label: "Newest first", value: "newest" },
    { label: "Oldest first", value: "oldest" },
    { label: "Recently updated", value: "updated" },
    { label: "By status", value: "status" },
];
</script>
