<template>
    <WidgetPanel
        title="Tooling usage"
        :meta="`Repo scripts over the last ${WINDOW_DAYS} days`"
        to="/telemetry"
    >
        <EmptyState v-if="!totals">Not collected.</EmptyState>
        <template v-else>
            <dl class="grid grid-cols-3 gap-3 border-b border-default px-4 py-3">
                <div v-for="figure in totals.figures" :key="figure.label">
                    <dt class="text-xs text-muted">{{ figure.label }}</dt>
                    <dd data-figure class="text-2xl leading-none" :class="figure.class">
                        {{ figure.value }}{{ figure.unit }}
                    </dd>
                </div>
            </dl>
            <ul class="divide-y divide-default">
                <li
                    v-for="script in totals.failing"
                    :key="script.name"
                    class="flex items-baseline gap-3 px-4 py-2"
                >
                    <span class="min-w-0 flex-1 truncate font-mono text-sm">{{ script.name }}</span>
                    <span class="tone-bad shrink-0 font-mono text-xs">
                        {{ script.failed }}% failed
                    </span>
                </li>
                <li v-if="totals.failing.length === 0" class="px-4 py-2 text-xs text-muted">
                    No script is failing.
                </li>
                <li v-if="totals.idle" class="px-4 py-2 text-xs text-muted">{{ totals.idle }}</li>
            </ul>
        </template>
    </WidgetPanel>
</template>

<script setup lang="ts">
import { WINDOW_DAYS } from "#layers/telemetry/shared/usage.ts";
import { isFailing, scriptRows, sumDays } from "#layers/telemetry/shared/usageView.ts";

const usage = usageArtifact();

const totals = computed(() => {
    if (!usage) return null;

    const rows = scriptRows(usage);
    const sum = sumDays(rows);
    const idle = rows.filter((row) => row.runs === 0).length;

    return {
        figures: [
            { label: "Runs", value: sum.runs, unit: "", class: "text-highlighted" },
            {
                label: "By agents",
                value: percentOf(sum.agent, sum.runs),
                unit: "%",
                class: "text-highlighted",
            },
            {
                label: "Failed",
                value: percentOf(sum.failures, sum.runs),
                unit: "%",
                class: isFailing(sum) ? toneClass("bad") : "text-highlighted",
            },
        ],
        failing: rows
            .filter((row) => row.failing)
            .map((row) => ({ name: row.name, failed: percentOf(row.failures, row.runs) })),
        idle: idle ? `${counted(idle, "script")} never run in the window.` : "",
    };
});
</script>
