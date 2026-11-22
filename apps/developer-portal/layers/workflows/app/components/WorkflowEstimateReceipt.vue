<template>
    <section :aria-label="$t('workflowEstimateReceipt.label')" class="flex flex-col gap-2">
        <p class="text-xs font-medium text-muted">{{ $t("workflowEstimateReceipt.title") }}</p>
        <ul class="flex flex-col gap-1.5 text-sm">
            <li
                v-for="(row, index) in rows"
                :key="row.id"
                class="flex items-baseline justify-between gap-3"
            >
                <span class="min-w-0 truncate" :class="row.nested ? 'pl-4 text-muted' : ''">
                    <span v-if="index > 0" class="text-dimmed">+ </span>{{ row.name
                    }}<span v-if="row.detail" class="text-xs text-muted"> · {{ row.detail }}</span>
                </span>
                <span class="shrink-0 text-muted tabular-nums">
                    {{ $t("workflowEstimateReceipt.points", { points: row.points }) }}
                </span>
            </li>
        </ul>
        <p
            class="flex justify-between border-t border-dashed border-default pt-2 text-sm font-semibold"
        >
            <span>{{ $t("workflowEstimateReceipt.total") }}</span>
            <span class="tabular-nums">
                {{ $t("workflowEstimateReceipt.points", { points: total }) }}
            </span>
        </p>
    </section>
</template>

<script setup lang="ts">
import type { ReceiptRow } from "#layers/workflows/shared/workflows.ts";

interface Props {
    rows: ReceiptRow[];
    total: number;
}

const { rows: receipt, total } = defineProps<Props>();

const { t } = useI18n();

const rows = computed(() =>
    receipt.map((row) => ({
        ...row,
        name:
            row.id === "core"
                ? t("workflowEstimateReceipt.core")
                : row.label || t("workflowEstimateReceipt.unnamed"),
        detail: [
            row.type,
            ...row.setup.map((block) => t("workflowEstimateReceipt.with", { block })),
        ]
            .filter(Boolean)
            .join(", "),
    })),
);
</script>
