<template>
    <SettingsSection
        title="Ticket size"
        hint="How many blocks share a ticket when filed. It can't change once one is."
    >
        <WorkflowTicketSizePicker v-model="size" :counts :editable />
    </SettingsSection>
</template>

<script setup lang="ts">
import type { TicketSize } from "#layers/workflows/shared/workflows.ts";

interface Props {
    counts: Record<TicketSize, number>;
    editable: boolean;
}

const { counts, editable } = defineProps<Props>();
const size = defineModel<TicketSize>({ required: true });
</script>
