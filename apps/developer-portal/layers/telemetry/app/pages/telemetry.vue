<template>
    <UDashboardPanel id="telemetry">
        <template #header>
            <PageHeader title="Tooling usage">
                <template #intro>
                    <PageFacts v-model:series="series" :provenance :facts />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <WidgetPanel v-if="!hasRuns" title="No runs committed yet">
                <p class="px-4 py-6 text-sm text-muted">
                    Scripts record each run into <code class="font-mono">.git</code>, and the next
                    commit carries the rows into
                    <code class="font-mono">data/telemetry/scripts</code>. Commit, then run
                    <code class="font-mono">pnpm exec nx collect @monorepo/developer-portal</code>.
                </p>
            </WidgetPanel>

            <template v-if="usage">
                <WidgetPanel v-model:filter="view" :title="chart.title" :filters="VIEWS">
                    <div v-if="view === 'chart'" class="px-4 pt-5 pb-4">
                        <DailyChart
                            :days
                            :values="chart.values"
                            :unit="chart.unit"
                            end-label="last day"
                        />
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
                                    <td
                                        class="numeric font-mono"
                                        :class="row.failures ? 'tone-bad' : ''"
                                    >
                                        {{ row.failures }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </WidgetPanel>

                <WidgetPanel
                    title="Repo scripts"
                    :meta="`Most run first · failing from ${MIN_RUNS} runs at ${FAILING_RATE * 100}% failed`"
                    :count="scripts.length"
                >
                    <div data-scroll-x class="overflow-x-auto">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Script</th>
                                    <th class="numeric">Runs</th>
                                    <th class="numeric hidden sm:table-cell">By agents</th>
                                    <th class="numeric">Failed</th>
                                    <th class="numeric">Last run</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in scripts" :key="row.name">
                                    <td class="font-mono text-highlighted">{{ row.name }}</td>
                                    <td class="numeric font-mono">{{ row.runs }}</td>
                                    <td class="numeric hidden font-mono sm:table-cell">
                                        {{ row.agentShare }}
                                    </td>
                                    <td
                                        class="numeric font-mono"
                                        :class="row.failing ? 'tone-bad' : ''"
                                    >
                                        {{ row.failShare }}
                                    </td>
                                    <td class="numeric font-mono text-muted" :title="row.lastExact">
                                        {{ row.lastShort }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </WidgetPanel>

                <TelemetryScriptActivity :usage />

                <TelemetryUsageTriage :usage />

                <TelemetryLintUsage :lint="usage.lint" />
            </template>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { FAILING_RATE, MIN_RUNS } from "#layers/telemetry/shared/usage.ts";
import {
    dailyTotals,
    isFailing,
    scriptRows,
    shownDays,
    sumDays,
} from "#layers/telemetry/shared/usageView.ts";
import type { PageFact } from "~/components/PageFacts.vue";

const VIEWS = [
    { value: "chart", label: "Chart" },
    { value: "table", label: "Table" },
];

type Series = "runs" | "agent" | "failures";

const SERIES = {
    runs: { title: "Runs per day", unit: "runs" },
    agent: { title: "Agent runs per day", unit: "agent runs" },
    failures: { title: "Failed runs per day", unit: "failed runs" },
} as const satisfies Record<Series, { title: string; unit: string }>;

const { data: snapshot } = await useSnapshot("usage");

const usage = computed(() => snapshot.value?.usage ?? null);

const hasRuns = computed(() => Object.keys(usage.value?.scripts ?? {}).length > 0);

const rows = computed(() => (usage.value ? scriptRows(usage.value) : []));
const sum = computed(() => sumDays(rows.value));

const scripts = computed(() =>
    rows.value
        .toSorted((a, b) => b.runs - a.runs)
        .map((row) => ({
            ...row,
            agentShare: row.runs ? `${percentOf(row.agent, row.runs)}%` : "—",
            failShare: row.runs ? `${percentOf(row.failures, row.runs)}%` : "—",
            lastShort: shortAge(row.last),
            lastExact: row.last ? relativeTime(row.last) : "",
        })),
);

const series = ref<string>("runs");
const view = ref("chart");

const days = computed(() => (usage.value ? shownDays(usage.value) : []));
const daily = computed(() => dailyTotals(rows.value));

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
    const key = series.value as Series;
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

const provenance = computed(
    () =>
        `Usage log · last ${usage.value?.windowDays ?? "—"} days · collected ${relativeTime(usage.value?.generatedAt)}`,
);

const share = (part: number): string =>
    sum.value.runs ? `${percentOf(part, sum.value.runs)}%` : "—";

const facts = computed((): PageFact[] => [
    { label: "Runs", value: String(sum.value.runs), series: "runs" },
    { label: "By agents", value: share(sum.value.agent), series: "agent" },
    {
        label: "Failed",
        value: share(sum.value.failures),
        class: isFailing(sum.value) ? "tone-bad" : "",
        series: "failures",
    },
    { label: "Scripts", value: String(scripts.value.length) },
    { label: "Never run", value: String(scripts.value.filter((row) => row.runs === 0).length) },
]);
</script>
