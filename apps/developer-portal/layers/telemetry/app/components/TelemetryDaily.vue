<template>
    <WidgetPanel v-model:filter="view" :title="chart.title" :filters="VIEWS">
        <div v-if="view === 'chart'" class="px-4 pt-5 pb-4">
            <DailyChart :days :values="chart.values" :unit="chart.unit" end-label="last day" />
            <p class="mt-4 text-sm text-toned">{{ chart.reading }}</p>
        </div>
        <div v-else class="max-h-96 overflow-y-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th class="numeric">Runs</th>
                        <th class="numeric">By agents</th>
                        <th class="numeric">Failed</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in dayRows" :key="row.day">
                        <td class="font-mono">{{ row.label }}</td>
                        <td class="numeric font-mono">{{ row.runs }}</td>
                        <td class="numeric font-mono">{{ row.agent }}</td>
                        <td class="numeric font-mono" :class="row.failures ? 'tone-bad' : ''">
                            {{ row.failures }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </WidgetPanel>
</template>

<script setup lang="ts">
import { dailyTotals, scriptRows, shownDays } from "#layers/telemetry/shared/usageView.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";

interface Props {
    usage: UsageArtifact;
    /** Which count the chart draws, picked from the page's facts. */
    series: string;
}

const { usage, series } = defineProps<Props>();

const VIEWS = [
    { value: "chart", label: "Chart" },
    { value: "table", label: "Table" },
];

const SERIES = {
    runs: { title: "Runs per day", unit: "runs" },
    agent: { title: "Agent runs per day", unit: "agent runs" },
    failures: { title: "Failed runs per day", unit: "failed runs" },
} as const satisfies Record<string, { title: string; unit: string }>;

type Series = keyof typeof SERIES;

const isSeries = (value: string): value is Series => Object.hasOwn(SERIES, value);

const view = ref("chart");

const days = computed(() => shownDays(usage));
const daily = computed(() => dailyTotals(scriptRows(usage)));

const dayRows = computed(() =>
    days.value
        .map((day, index) => ({
            day,
            label: calendarDay(day),
            runs: daily.value[index]?.runs ?? 0,
            agent: daily.value[index]?.agent ?? 0,
            failures: daily.value[index]?.failures ?? 0,
        }))
        .toReversed(),
);

const chart = computed(() => {
    const key: Series = isSeries(series) ? series : "runs";
    const { title, unit } = SERIES[key];
    const values = days.value.map((_, index) => daily.value[index]?.[key] ?? 0);
    const total = values.reduce((acc, value) => acc + value, 0);
    const peak = Math.max(0, ...values);
    const peakDay = days.value[values.indexOf(peak)] ?? "";
    const average = values.length ? Math.round((total / values.length) * 10) / 10 : 0;

    return {
        title,
        unit,
        values,
        reading:
            total === 0
                ? `No ${unit} in the window.`
                : `${average} ${unit} a day on average; the busiest day was ${calendarDay(peakDay)}, with ${peak}.`,
    };
});
</script>
