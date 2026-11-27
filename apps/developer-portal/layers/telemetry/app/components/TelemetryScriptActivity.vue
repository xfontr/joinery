<template>
    <WidgetPanel
        :title="$t('telemetryScriptActivity.title')"
        :meta="$t('telemetryScriptActivity.meta', { runs: MIN_RUNS, percent: failingPercent })"
        :count="rows.length"
    >
        <ul
            class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-default px-4 py-2 text-xs text-muted"
        >
            <li v-for="item in legend" :key="item.id" class="flex items-center gap-1.5">
                <span class="size-2.5 bg-accented/40" :style="item.style" />
                {{ $t(`telemetryScriptActivity.legend.${item.id}`) }}
            </li>
        </ul>

        <div data-scroll-x class="overflow-x-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>{{ $t("telemetryScriptActivity.columns.script") }}</th>
                        <th class="hidden w-full md:table-cell">
                            <ol class="flex min-w-xl" aria-hidden="true">
                                <li
                                    v-for="column in months"
                                    :key="column.day"
                                    class="min-w-0 flex-1"
                                >
                                    <span v-if="column.month" class="whitespace-nowrap">
                                        {{ column.month }}
                                    </span>
                                </li>
                            </ol>
                        </th>
                        <th class="numeric">{{ $t("telemetryScriptActivity.columns.runs") }}</th>
                        <th class="whitespace-nowrap">
                            {{ $t("telemetryScriptActivity.columns.agent") }}
                        </th>
                        <th class="numeric">{{ $t("telemetryScriptActivity.columns.failed") }}</th>
                        <th class="numeric">{{ $t("telemetryScriptActivity.columns.median") }}</th>
                        <th class="numeric whitespace-nowrap">
                            {{ $t("telemetryScriptActivity.columns.last") }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.name">
                        <td class="font-mono whitespace-nowrap text-highlighted">{{ row.name }}</td>
                        <td class="hidden md:table-cell">
                            <TelemetryDayStrip :days :usage="row.days" :busiest />
                        </td>
                        <td class="numeric font-mono">{{ row.runs }}</td>
                        <td>
                            <span class="flex items-center gap-2">
                                <TelemetryCallerSplit :runs="row.total" :agent="row.agent" />
                                <span class="font-mono text-xs">{{ row.agentShare }}</span>
                            </span>
                        </td>
                        <td class="numeric font-mono" :class="row.failing && 'tone-bad'">
                            {{ row.failed }}
                        </td>
                        <td class="numeric font-mono whitespace-nowrap">{{ row.median }}</td>
                        <td
                            class="numeric font-mono whitespace-nowrap text-muted"
                            :title="row.lastExact"
                        >
                            {{ row.last }}
                        </td>
                    </tr>
                </tbody>
                <tfoot class="border-t border-default">
                    <tr>
                        <th scope="row" class="text-xs whitespace-nowrap">
                            {{ $t("telemetryScriptActivity.all") }}
                        </th>
                        <td class="hidden md:table-cell">
                            <TelemetryDayStrip :days :usage="totals" :busiest="busiestTotal" />
                        </td>
                        <td class="numeric font-mono font-medium">{{ total.runs }}</td>
                        <td>
                            <span class="flex items-center gap-2">
                                <TelemetryCallerSplit :runs="total.runs" :agent="total.agent" />
                                <span class="font-mono text-xs">{{ total.agentShare }}</span>
                            </span>
                        </td>
                        <td class="numeric font-mono font-medium">{{ total.failed }}</td>
                        <td />
                        <td />
                    </tr>
                </tfoot>
            </table>
        </div>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { DayUsage } from "#layers/snapshot/shared/types/DayUsage.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import { FAILING_RATE, MIN_RUNS } from "#layers/telemetry/shared/usage.ts";
import {
    dailyTotals,
    formatMs,
    scriptRows,
    shownDays,
    sumDays,
} from "#layers/telemetry/app/utils/usageView.ts";

interface Props {
    usage: Omit<UsageArtifact, "lint">;
}

const { usage } = defineProps<Props>();

const legend = [
    { id: "runs", style: { background: "var(--usage-runs)" } },
    { id: "agent", style: { background: "var(--usage-agent)" } },
    { id: "person", style: { background: "var(--usage-person)" } },
    { id: "failed", style: { boxShadow: FAILED_MARK } },
];

const { t } = useI18n();

const failingPercent = Math.round(FAILING_RATE * 100);

const failedShare = ({ known, failures }: DayUsage): string =>
    known ? `${percentOf(failures, known)}%` : "—";

const agentShare = ({ runs, agent }: DayUsage): string =>
    runs ? `${percentOf(agent, runs)}%` : "—";

const medianOf = (name: string): string => {
    const durations = usage.scripts[name]?.durations;
    return durations ? formatMs(durations.medianMs) : "—";
};

const days = computed(() => shownDays(usage));
const scripts = computed(() => scriptRows(usage));

const rows = computed(() =>
    scripts.value.map((row) => ({
        name: row.name,
        days: row.days,
        runs: row.runs || "—",
        total: row.runs,
        agent: row.agent,
        failing: row.failing,
        failed: failedShare(row),
        median: medianOf(row.name),
        agentShare: agentShare(row),
        last: shortAge(row.last, t),
        lastExact: row.last ? calendarDay(row.last.slice(0, 10)) : "",
    })),
);

const totals = computed(() => dailyTotals(scripts.value));

const total = computed(() => {
    const sum = sumDays(totals.value);

    return { ...sum, failed: failedShare(sum), agentShare: agentShare(sum) };
});

const busiest = computed(() =>
    Math.max(1, ...scripts.value.flatMap((row) => row.days.map((day) => day.runs))),
);
const busiestTotal = computed(() => Math.max(1, ...totals.value.map((day) => day.runs)));

/** A month gets a label on its first day, or at the start when at least a week of it is shown. */
const labelsMonth = (day: string, index: number): boolean => {
    if (day.endsWith("-01")) return true;
    if (index !== 0) return false;

    return days.value.slice(0, 7).every((next) => next.slice(0, 7) === day.slice(0, 7));
};

const months = computed(() =>
    days.value.map((day, index) => ({
        day,
        month: labelsMonth(day, index) ? calendarDay(day, "only") : null,
    })),
);
</script>
