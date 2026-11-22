<template>
    <WidgetPanel
        title="Tooling runs per day"
        :meta="`Usage log · collected ${age}`"
        to="/telemetry"
    >
        <div class="px-4 pt-5 pb-4">
            <DailyChart :days :values="runs" unit="runs" end-label="last day" />
        </div>
    </WidgetPanel>
</template>

<script setup lang="ts">
import { dailyTotals, scriptRows, shownDays } from "#layers/telemetry/shared/usageView.ts";

const usage = usageArtifact();
const age = relativeTime(usage?.generatedAt);
const days = usage ? shownDays(usage) : [];
const runs = usage ? dailyTotals(scriptRows(usage)).map((day) => day.runs) : [];
</script>
