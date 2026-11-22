<template>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
            label="Reports"
            :value="reports.length"
            hint="one file per decision"
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
import type { DecisionStatus } from "#layers/snapshot/shared/decisions.ts";

interface Props {
    reports: DecisionReport[];
}

const { reports } = defineProps<Props>();

const TILES: { status: DecisionStatus; hint: string }[] = [
    { status: "to-implement", hint: "decided, not in the repo yet" },
    { status: "implemented", hint: "the work has landed" },
    { status: "wont-implement", hint: "decided against, deliberately" },
];

const counts = computed(() => countByStatus(reports));

const tiles = computed(() =>
    TILES.map(({ status, hint }) => ({
        status,
        hint,
        label: decisionStatusLabel(status),
        value: counts.value[status],
        tone: decisionStatusTone(status),
    })),
);
</script>
