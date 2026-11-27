<template>
    <div
        data-pane
        class="hidden w-88 shrink-0 justify-end overflow-hidden data-floating:absolute data-floating:inset-y-0 data-floating:right-0 data-floating:z-10 xl:flex"
    >
        <UDashboardPanel
            id="workflow-block"
            :default-size="22"
            :min-size="22"
            :ui="{ body: 'gap-0 bg-default p-0 sm:p-0' }"
        >
            <template #body>
                <WorkflowBlock
                    :capability
                    :stage
                    :stage-index
                    :project
                    :titles
                    :activity
                    :can-settle
                    @select="emit('select', $event)"
                    @settle="emit('settle', $event)"
                    @hide="emit('hide')"
                />
            </template>
        </UDashboardPanel>

        <USlideover v-model:open="open" :title="capability.title" :description="stage.title">
            <template #body>
                <WorkflowCapabilityDetail
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
    </div>
</template>

<script setup lang="ts">
import type {
    CapabilityView,
    SettledState,
    StageView,
} from "#layers/workflows/shared/workflows.ts";
import type { CapabilityActivity } from "#layers/workflows/app/utils/workflowActivity.ts";

interface Props {
    capability: CapabilityView;
    stage: StageView;
    stageIndex: number;
    project: string;
    titles: Record<string, string>;
    activity?: CapabilityActivity | null;
    canSettle: boolean;
}

const {
    capability,
    stage,
    stageIndex,
    project,
    titles,
    activity = null,
    canSettle,
} = defineProps<Props>();
const emit = defineEmits<{
    select: [capability: string];
    settle: [settlement: { status: SettledState; note: string } | null];
    hide: [];
}>();
const open = defineModel<boolean>("open", { required: true });
</script>
