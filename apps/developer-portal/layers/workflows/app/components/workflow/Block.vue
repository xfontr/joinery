<template>
    <article class="flex flex-col">
        <header class="relative border-b border-default py-4 pr-12 pl-4 sm:pl-6">
            <UButton
                icon="i-lucide-panel-right-close"
                color="neutral"
                variant="ghost"
                size="sm"
                class="absolute top-3 right-3"
                :aria-label="$t('workflowBlock.hide')"
                @click="emit('hide')"
            />
            <p class="flex items-center gap-2 text-xs text-muted">
                <span class="size-2 rounded-xs" :style="{ background: color }" aria-hidden="true" />
                {{ stage.title }}
            </p>
            <h2 class="mt-1 text-lg/snug font-semibold text-highlighted">
                {{ capability.title }}
            </h2>
        </header>
        <WorkflowCapabilityDetail
            :capability
            :project
            :titles
            :activity
            :can-settle
            class="p-4 sm:px-6"
            @select="emit('select', $event)"
            @settle="emit('settle', $event)"
        />
    </article>
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
    /** The stage's place in the template, which picks its colour. */
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

const color = computed(() => stageColor(stageIndex));
</script>
