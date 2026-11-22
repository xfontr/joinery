<template>
    <SettingsSection
        title="Features"
        hint="Leaving one out takes its blocks out of the map; whatever needed them waits on what they needed."
    >
        <WorkflowFeaturePicker :features :editable @toggle="(id, on) => emit('toggle', id, on)" />
    </SettingsSection>
</template>

<script setup lang="ts">
import type { Feature } from "#layers/workflows/shared/workflows.ts";

interface Props {
    features: Feature[];
    editable: boolean;
}

const { features, editable } = defineProps<Props>();
const emit = defineEmits<{ toggle: [feature: string, on: boolean] }>();
</script>
