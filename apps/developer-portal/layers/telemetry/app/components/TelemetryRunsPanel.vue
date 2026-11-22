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

const { data: usage } = await useSnapshot("usage");

const age = computed(() => relativeTime(usage.value?.usage?.generatedAt));
const days = computed(() => (usage.value?.usage ? shownDays(usage.value.usage) : []));
const runs = computed(() =>
    usage.value?.usage ? dailyTotals(scriptRows(usage.value.usage)).map((day) => day.runs) : [],
);
</script>
