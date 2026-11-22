<template>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
            :label="$t('auditsTiles.audits')"
            :value="reports.length"
            :hint="$t('auditsTiles.closed', { count: totals.states.closed })"
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

const TILES: FindingStatus[] = ["open", "fixed", "wont-fix"];

const { t } = useI18n();

const totals = computed(() => countAll(reports));

const tiles = computed(() =>
    TILES.map((status) => ({
        status,
        hint: t(`auditsTiles.hints.${status}`),
        label: t(`audits.findingStatus.${status}`),
        value: totals.value.findings[status],
        tone: findingStatusTone(status),
    })),
);
</script>
