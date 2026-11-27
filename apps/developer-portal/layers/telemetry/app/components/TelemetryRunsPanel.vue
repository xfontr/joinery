<template>
    <WidgetPanel
        :title="$t('telemetryRunsPanel.title')"
        :meta="$t('telemetryRunsPanel.meta')"
        to="/telemetry"
    >
        <div class="px-4 pt-5 pb-4">
            <DailyChart
                :days
                :values="runs"
                :unit="$t('telemetryRunsPanel.unit')"
                :end-label="$t('telemetryRunsPanel.endLabel')"
            />
        </div>
    </WidgetPanel>
</template>

<script setup lang="ts">
import { dailyTotals, scriptRows, shownDays } from "#layers/telemetry/shared/usageView.ts";

const usage = usageArtifact();
const days = usage ? shownDays(usage) : [];
const runs = usage ? dailyTotals(scriptRows(usage)).map((day) => day.runs) : [];
</script>
