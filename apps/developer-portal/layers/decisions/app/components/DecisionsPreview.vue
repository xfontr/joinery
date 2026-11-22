<template>
    <div class="relative pt-3 pr-3">
        <div class="absolute inset-0 top-0 left-3 border border-default bg-muted" />
        <div class="absolute inset-0 top-1.5 left-1.5 border border-default bg-default" />
        <div class="relative flex flex-col gap-3 border border-default bg-elevated p-4">
            <div class="flex items-center justify-between gap-2">
                <span class="font-mono text-xs text-muted">
                    {{ $t("decisionsPreview.number", { number: report.number }) }}
                </span>
                <StatusPill v-if="status" :label="status.label" :tone="status.tone" />
            </div>
            <span class="font-display text-2xl/tight text-highlighted">{{ report.title }}</span>
            <div class="flex flex-col gap-1.5">
                <span v-for="line in LINES" :key="line" class="h-1.5 bg-accented" :class="line" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DecisionReport } from "#layers/decisions/shared/decisionReports.ts";

interface Props {
    report: DecisionReport;
}

const { report } = defineProps<Props>();

/** Stand-in lines for the report's body, at the widths a paragraph's last line leaves. */
const LINES = ["w-full", "w-11/12", "w-2/3"] as const;

const { t } = useI18n();

const status = computed(() =>
    report.status
        ? { label: t(`decisions.status.${report.status}`), tone: decisionStatusTone(report.status) }
        : null,
);
</script>
