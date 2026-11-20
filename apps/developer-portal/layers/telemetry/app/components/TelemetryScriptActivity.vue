<template>
    <WidgetPanel
        title="Repo scripts"
        :meta="`Most run first · failing from ${MIN_RUNS} runs at ${failingPercent}% failed`"
        :count="rows.length"
    >
        <ul
            class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-default px-4 py-2 text-xs text-muted"
        >
            <li v-for="item in legend" :key="item.label" class="flex items-center gap-1.5">
                <span class="size-2.5 bg-accented/40" :style="item.style" />
                {{ item.label }}
            </li>
        </ul>

        <div data-scroll-x class="overflow-x-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Script</th>
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
                        <th class="numeric">Runs</th>
                        <th class="whitespace-nowrap">By agents</th>
                        <th class="numeric">Failed</th>
                        <th class="numeric whitespace-nowrap">Last run</th>
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
                        <th scope="row" class="text-xs whitespace-nowrap">All scripts</th>
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
import { dailyTotals, scriptRows, shownDays, sumDays } from "#layers/telemetry/shared/usageView.ts";

interface Props {
    usage: Omit<UsageArtifact, "lint">;
}

const { usage } = defineProps<Props>();

const legend = [
    { label: "Runs that day", style: { background: "var(--usage-runs)" } },
    { label: "Agent", style: { background: "var(--usage-agent)" } },
    { label: "Person", style: { background: "var(--usage-person)" } },
    { label: "A run failed", style: { boxShadow: FAILED_MARK } },
];

const failingPercent = Math.round(FAILING_RATE * 100);

const failedShare = ({ runs, failures }: DayUsage): string =>
    runs ? `${percentOf(failures, runs)}%` : "—";

const agentShare = ({ runs, agent }: DayUsage): string =>
    runs ? `${percentOf(agent, runs)}%` : "—";

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
        agentShare: agentShare(row),
        last: shortAge(row.last),
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
