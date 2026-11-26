<template>
    <NuxtLink
        :to="`/decisions/${report.id}`"
        class="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-elevated/50"
    >
        <span class="shrink-0 font-mono text-xs text-dimmed">{{ report.number }}</span>
        <span class="flex-1 truncate text-sm">{{ report.title }}</span>

        <StatusPill
            v-if="superseded"
            :label="superseded.label"
            tone="bad"
            :hint="superseded.hint"
        />
        <StatusPill v-if="status" :label="status.label" :tone="status.tone" />

        <span class="w-24 shrink-0 text-right text-xs text-dimmed">{{ updated }}</span>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { DecisionReport } from "#layers/decisions/shared/decisionReports.ts";

interface Props {
    report: DecisionReport;
}

const { report } = defineProps<Props>();

const { t } = useI18n();

const superseded = computed(() =>
    report.decision === "superseded"
        ? {
              label: t("decisions.outcome.superseded"),
              hint: t("decisions.supersededBy", { by: report.supersededBy }),
          }
        : null,
);
const status = computed(() =>
    report.status
        ? { label: t(`decisions.status.${report.status}`), tone: decisionStatusTone(report.status) }
        : null,
);
const updated = computed(() => relativeTime(report.updatedAt, t));
</script>
