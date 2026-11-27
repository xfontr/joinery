<template>
    <WidgetPanel :title="$t('telemetryBuildTimes.title')" :meta="$t('telemetryBuildTimes.meta')">
        <div data-scroll-x class="overflow-x-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>{{ $t("telemetryBuildTimes.columns.name") }}</th>
                        <th class="numeric">{{ $t("telemetryBuildTimes.columns.median") }}</th>
                        <th class="numeric whitespace-nowrap">
                            {{ $t("telemetryBuildTimes.columns.slowest") }}
                        </th>
                        <th class="numeric whitespace-nowrap">
                            {{ $t("telemetryBuildTimes.columns.prePush") }}
                        </th>
                        <th class="numeric">{{ $t("telemetryBuildTimes.columns.runs") }}</th>
                        <th class="numeric whitespace-nowrap">
                            {{ $t("telemetryBuildTimes.columns.hits") }}
                        </th>
                    </tr>
                </thead>
                <tbody v-for="section in sections" :key="section.id">
                    <tr>
                        <th colspan="6" scope="colgroup" class="text-xs text-muted">
                            {{ $t(`telemetryBuildTimes.sections.${section.id}`) }}
                        </th>
                    </tr>
                    <tr v-if="section.rows.length === 0">
                        <td colspan="6" class="text-xs text-muted">{{ section.empty }}</td>
                    </tr>
                    <tr v-for="row in section.rows" :key="`${row.kind}:${row.name}`">
                        <td class="whitespace-nowrap" :class="row.mono && 'font-mono text-xs'">
                            {{ row.label }}
                        </td>
                        <td class="numeric font-mono font-medium">{{ row.median }}</td>
                        <td class="numeric font-mono">{{ row.slowest }}</td>
                        <td class="numeric font-mono text-muted">{{ row.prePush }}</td>
                        <td class="numeric font-mono text-muted">{{ row.runs }}</td>
                        <td class="numeric font-mono text-muted">{{ row.hits }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import {
    ciBuildTimes,
    formatMs,
    localBuildTimes,
    type BuildTimeRow,
} from "#layers/telemetry/app/utils/usageView.ts";

interface Props {
    usage: Pick<UsageArtifact, "scripts" | "tasks" | "ci">;
}

const { usage } = defineProps<Props>();

const { t } = useI18n();

const labelOf = ({ kind, name }: BuildTimeRow): string => {
    if (kind === "check") return t("telemetryBuildTimes.check");
    if (kind === "job") return t("telemetryBuildTimes.job", { name });
    return name;
};

const display = (row: BuildTimeRow) => ({
    kind: row.kind,
    name: row.name,
    label: labelOf(row),
    mono: row.kind === "target" || row.kind === "step",
    median: row.durations ? formatMs(row.durations.medianMs) : "—",
    slowest: row.durations ? formatMs(row.durations.p90Ms) : "—",
    prePush: row.prePushMs === null ? "—" : formatMs(row.prePushMs),
    runs: row.durations?.runs ?? "—",
    hits: row.hitShare === null ? "—" : `${percentOf(row.hitShare, 1)}%`,
});

const sections = computed(() => [
    {
        id: "local",
        rows: localBuildTimes(usage).map(display),
        empty: t("telemetryBuildTimes.emptyLocal"),
    },
    {
        id: "ci",
        rows: ciBuildTimes(usage).map(display),
        empty:
            usage.ci === null
                ? t("telemetryBuildTimes.ciUnread")
                : t("telemetryBuildTimes.emptyCi"),
    },
]);
</script>
