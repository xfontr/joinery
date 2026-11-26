<template>
    <NuxtLink
        :to="`/audits/${report.id}`"
        class="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-elevated/50"
    >
        <span class="shrink-0 font-mono text-xs text-dimmed">{{ report.date }}</span>
        <span class="flex-1 truncate text-sm">{{ report.title }}</span>
        <code v-if="report.scope" class="hidden shrink-0 font-mono text-xs text-dimmed md:inline">{{
            report.scope
        }}</code>

        <UProgress :model-value="settled" :max="scale" size="sm" class="w-24 shrink-0" />
        <span class="w-14 shrink-0 text-right text-xs text-muted tabular-nums">
            {{ settled }}/{{ report.findings.length }}
        </span>

        <StatusPill :label="state.label" :tone="state.tone" />
    </NuxtLink>
</template>

<script setup lang="ts">
import type { AuditReport } from "#layers/audits/shared/auditReports.ts";

interface Props {
    report: AuditReport;
}

const { report } = defineProps<Props>();

const settled = computed(() => report.findings.length - report.counts.open);
// An audit with no findings still draws an empty bar rather than dividing by zero.
const scale = computed(() => Math.max(report.findings.length, 1));
const { t } = useI18n();

const state = computed(() => ({
    label: t(`audits.state.${report.state}`),
    tone: auditStateTone(report.state),
}));
</script>
