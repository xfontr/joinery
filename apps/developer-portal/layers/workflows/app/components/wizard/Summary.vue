<template>
    <UCard>
        <p class="text-xs text-muted">{{ template ?? $t("wizardSummary.noTemplate") }}</p>
        <p class="truncate font-semibold">{{ title || $t("wizardSummary.untitled") }}</p>
        <div class="mt-4 flex gap-6 tabular-nums">
            <div v-for="figure in figures" :key="figure.id">
                <p class="text-2xl font-semibold">{{ figure.value }}</p>
                <p class="text-xs text-muted">{{ $t(`wizardSummary.units.${figure.id}`) }}</p>
            </div>
        </div>
        <WorkflowEstimateReceipt
            v-if="receipt.length > 0"
            :rows="receipt"
            :total="points"
            class="mt-4 border-t border-default pt-4"
        />
        <div class="mt-4 border-t border-default pt-4">
            <p class="mb-2 text-xs font-medium text-muted">{{ $t("wizardSummary.ticketSize") }}</p>
            <WorkflowTicketSizePicker v-model="ticketSize" :counts="tickets" editable compact />
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { ReceiptRow, TicketSize } from "#layers/workflows/shared/workflows.ts";

interface Props {
    /** The template's title, or null before one is picked. */
    template: string | null;
    title: string;
    blocks: number;
    tickets: Record<TicketSize, number>;
    points: number;
    receipt: ReceiptRow[];
}

const { template, title, blocks, tickets, points, receipt } = defineProps<Props>();
const ticketSize = defineModel<TicketSize>("ticketSize", { required: true });

const figures = computed(() => [
    { id: "blocks", value: blocks },
    { id: "tickets", value: tickets[ticketSize.value] },
    { id: "points", value: points },
]);
</script>
