<template>
    <PageFacts :provenance="$t('decisionsFacts.provenance')" :facts />
</template>

<script setup lang="ts">
import { countByStatus, type DecisionReport } from "#layers/decisions/shared/decisionReports.ts";
import { DECISION_STATUSES } from "#layers/snapshot/shared/decisions.ts";
import type { PageFact } from "~/types/PageFact";

interface Props {
    reports: DecisionReport[];
}

const { reports } = defineProps<Props>();

const { t } = useI18n();

const counts = computed(() => countByStatus(reports));

const facts = computed((): PageFact[] => [
    { label: t("decisionsFacts.reports"), value: String(reports.length) },
    ...DECISION_STATUSES.map((status) => ({
        label: t(`decisions.status.${status}`),
        value: String(counts.value[status]),
        class: counts.value[status] ? toneClass(decisionStatusTone(status)) : "",
    })),
]);
</script>
