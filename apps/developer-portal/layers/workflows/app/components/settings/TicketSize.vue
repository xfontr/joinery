<template>
    <SettingsSection :title="$t('settingsTicketSize.title')" :hint="$t('settingsTicketSize.hint')">
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
