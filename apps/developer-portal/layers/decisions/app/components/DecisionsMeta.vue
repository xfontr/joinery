<template>
    <StatusPill
        v-if="supersession"
        :label="supersession.label"
        tone="bad"
        :to="supersession.to"
        :hint="supersession.hint"
    />
    <StatusPill v-if="status" :label="status.label" :tone="status.tone" />
    <DocSource :source :words="report?.words" :updated-at="report?.updatedAt" />
</template>

<script setup lang="ts">
import type { DecisionReport } from "#layers/decisions/shared/decisionReports.ts";

interface Props {
    report: DecisionReport | null;
    /** The repo path of the report's markdown file. */
    source: string;
}

const { report, source } = defineProps<Props>();

const supersession = computed(() => {
    const by = report?.decision === "superseded" ? report.supersededBy : null;

    return by
        ? {
              label: decisionOutcomeLabel("superseded"),
              to: `/decisions/${by.replace(/\.md$/, "")}`,
              hint: `Superseded by ${by}`,
          }
        : null;
});

const status = computed(() =>
    report?.status
        ? { label: decisionStatusLabel(report.status), tone: decisionStatusTone(report.status) }
        : null,
);
</script>
