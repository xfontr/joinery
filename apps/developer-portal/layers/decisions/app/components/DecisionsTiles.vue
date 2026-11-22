<template>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
            :label="$t('decisionsTiles.reports')"
            :value="reports.length"
            :hint="$t('decisionsTiles.reportsHint')"
            icon="i-lucide-compass"
        />
        <StatTile
            v-for="tile in tiles"
            :key="tile.status"
            :label="tile.label"
            :value="tile.value"
            :hint="tile.hint"
            :tone="tile.tone"
        />
    </div>
</template>

<script setup lang="ts">
import { countByStatus, type DecisionReport } from "#layers/decisions/shared/decisionReports.ts";
import { DECISION_STATUSES } from "#layers/snapshot/shared/decisions.ts";

interface Props {
    reports: DecisionReport[];
}

const { reports } = defineProps<Props>();

const { t } = useI18n();

const counts = computed(() => countByStatus(reports));

const tiles = computed(() =>
    DECISION_STATUSES.map((status) => ({
        status,
        hint: t(`decisionsTiles.hints.${status}`),
        label: t(`decisions.status.${status}`),
        value: counts.value[status],
        tone: decisionStatusTone(status),
    })),
);
</script>
