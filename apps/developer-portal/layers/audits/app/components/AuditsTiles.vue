<template>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
            label="Audits"
            :value="reports.length"
            :hint="`${totals.states.closed} closed`"
            icon="i-lucide-scan-search"
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
import { countAll, type AuditReport } from "#layers/audits/shared/auditReports.ts";
import type { FindingStatus } from "#layers/snapshot/shared/audits.ts";

interface Props {
    reports: AuditReport[];
}

const { reports } = defineProps<Props>();

const TILES: { status: FindingStatus; hint: string }[] = [
    { status: "open", hint: "findings still owed work" },
    { status: "fixed", hint: "the fix has landed" },
    { status: "wont-fix", hint: "decided against, deliberately" },
];

const totals = computed(() => countAll(reports));

const tiles = computed(() =>
    TILES.map(({ status, hint }) => ({
        status,
        hint,
        label: findingStatusLabel(status),
        value: totals.value.findings[status],
        tone: findingStatusTone(status),
    })),
);
</script>
