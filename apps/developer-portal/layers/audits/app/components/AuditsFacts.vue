<template>
    <PageFacts :facts />
</template>

<script setup lang="ts">
import { countAll, type AuditReport } from "#layers/audits/shared/auditReports.ts";
import { FINDING_STATUSES } from "#layers/snapshot/shared/audits.ts";
import type { PageFact } from "~/types/PageFact";

interface Props {
    reports: AuditReport[];
}

const { reports } = defineProps<Props>();

const { t } = useI18n();

const totals = computed(() => countAll(reports));

const facts = computed((): PageFact[] => [
    { label: t("auditsFacts.audits"), value: String(reports.length) },
    ...FINDING_STATUSES.map((status) => ({
        label: t(`audits.findingStatus.${status}`),
        value: String(totals.value.findings[status]),
        class: totals.value.findings[status] ? toneClass(findingStatusTone(status)) : "",
    })),
]);
</script>
