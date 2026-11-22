<template>
    <USlideover v-model:open="open" :title="capability?.title" :description="stage">
        <template #body>
            <WorkflowCapabilityDetail
                v-if="capability"
                :capability
                :project
                :titles
                :activity
                :can-settle
                @select="emit('select', $event)"
                @settle="emit('settle', $event)"
            />
        </template>
    </USlideover>
</template>

<script setup lang="ts">
import type { CapabilityView, SettledState } from "#layers/workflows/shared/workflows.ts";
import type { CapabilityActivity } from "#layers/workflows/shared/workflowActivity.ts";

interface Props {
    capability?: CapabilityView;
    /** The title of the stage holding the capability. */
    stage?: string;
    project: string;
    titles: Record<string, string>;
    activity?: CapabilityActivity | null;
    canSettle: boolean;
}

const { capability, stage, project, titles, activity = null, canSettle } = defineProps<Props>();
const emit = defineEmits<{
    select: [capability: string];
    settle: [settlement: { status: SettledState; note: string } | null];
}>();
const open = defineModel<boolean>("open", { required: true });
</script>
