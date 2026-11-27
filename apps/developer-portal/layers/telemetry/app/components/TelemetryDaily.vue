<template>
    <WidgetPanel v-model:filter="view" :title="chart.title" :filters="VIEWS">
        <div v-if="view === 'chart'" class="px-4 pt-5 pb-4">
            <DailyChart
                :days
                :values="chart.values"
                :unit="chart.unit"
                :end-label="$t('telemetryDaily.endLabel')"
            />
            <p class="mt-4 text-sm text-toned">{{ chart.reading }}</p>
        </div>
        <div v-else class="max-h-96 overflow-y-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>{{ $t("telemetryDaily.columns.day") }}</th>
                        <th class="numeric">{{ $t("telemetryDaily.columns.runs") }}</th>
                        <th class="numeric">{{ $t("telemetryDaily.columns.agent") }}</th>
                        <th class="numeric">{{ $t("telemetryDaily.columns.failed") }}</th>
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
import { dailyTotals, scriptRows, shownDays } from "#layers/telemetry/app/utils/usageView.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";

interface Props {
    usage: UsageArtifact;
    /** Which count the chart draws, picked from the page's facts. */
    series: string;
}

const { usage, series } = defineProps<Props>();

const { t } = useI18n();

const VIEWS = [
    { value: "chart", label: t("telemetryDaily.views.chart") },
    { value: "table", label: t("telemetryDaily.views.table") },
];

const SERIES = ["runs", "agent", "failures"] as const;

type Series = (typeof SERIES)[number];

const isSeries = (value: string): value is Series => (SERIES as readonly string[]).includes(value);

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
    const title = t(`telemetryDaily.series.${key}.title`);
    const unit = t(`telemetryDaily.series.${key}.unit`);
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
                ? t("telemetryDaily.readingNone", { unit })
                : t("telemetryDaily.reading", {
                      average,
                      unit,
                      day: calendarDay(peakDay),
                      peak,
                  }),
    };
});
</script>
