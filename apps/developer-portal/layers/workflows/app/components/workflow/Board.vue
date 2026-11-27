<template>
    <div ref="root" class="flex flex-col gap-6">
        <div>
            <div class="mb-4 border-b border-default pb-3">
                <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <UButton
                        v-if="activity || days > 0"
                        :label="$t('workflowBoard.activity')"
                        icon="i-lucide-chart-column"
                        :trailing-icon="
                            showActivity ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
                        "
                        color="neutral"
                        variant="ghost"
                        size="xs"
                        class="-ml-2"
                        :aria-expanded="showActivity"
                        @click="showActivity = !showActivity"
                    />
                    <div class="min-w-0 flex-1"><slot name="summary" /></div>
                </div>
                <UCollapsible v-if="activity || days > 0" v-model:open="showActivity">
                    <template #content>
                        <div class="flex flex-wrap items-start gap-x-8 gap-y-3 pt-3">
                            <WorkflowActivityStrip
                                v-if="activity"
                                :activity
                                :stages="syncedStages"
                                class="w-full shrink-0 sm:w-80"
                            />
                            <WorkflowReplay
                                v-if="days > 0"
                                v-model:day="day"
                                :days
                                :label="dayLabel"
                            />
                        </div>
                    </template>
                </UCollapsible>
            </div>
            <WorkflowSkyline
                :stages
                :selected="activeStage?.id ?? null"
                :highlight="selected?.id ?? null"
                @select-stage="emit('selectStage', $event)"
                @select="emit('select', $event)"
            />
            <button
                v-if="selected && picked"
                type="button"
                class="mt-3 flex max-w-full items-center gap-2 rounded-md px-1.5 py-0.5 text-left text-xs text-muted transition hover:bg-elevated hover:text-default"
                :style="{ '--state': picked.color }"
                @click="scrollToBlock(selected.id)"
            >
                <span class="size-2 shrink-0 rounded-xs bg-(--state)" aria-hidden="true" />
                <span class="truncate font-semibold text-default">{{ selected.title }}</span>
                <span class="shrink-0">{{ picked.state }}</span>
                <UIcon name="i-lucide-arrow-down" class="size-3.5 shrink-0" />
            </button>
        </div>

        <WorkflowStageCards
            v-if="activeStage"
            :stage="activeStage"
            :index="activeIndex"
            :selected="selected?.id ?? null"
            :activity="activity?.capabilities"
            :activity-peak="activity?.peak"
            @select="emit('select', $event)"
            @details="emit('details', $event)"
        />
    </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import type { CapabilityView, StageView } from "#layers/workflows/shared/workflows.ts";
import type { ProjectActivity } from "#layers/workflows/app/utils/workflowActivity.ts";

interface Props {
    stages: StageView[];
    /** The synced stages, which the activity strip reads whatever day is replayed. */
    syncedStages: StageView[];
    activeStage?: StageView;
    activeIndex: number;
    selected?: CapabilityView;
    activity: ProjectActivity | null;
    /** How many days the replay covers; none hides it. */
    days: number;
    dayLabel: string;
}

const { stages, syncedStages, activeStage, activeIndex, selected, activity, days, dayLabel } =
    defineProps<Props>();
const emit = defineEmits<{
    selectStage: [stage: string];
    select: [capability: string];
    details: [capability: string];
}>();
const day = defineModel<number>("day", { required: true });

// The server has no saved choice, so the browser's copy is read only once hydration is done.
const showActivity = useLocalStorage("workflow-activity", false, { initOnMounted: true });

// Hidden, the replay can't be seen, so the board returns to today rather than staying on a past day.
watch(showActivity, (shown) => {
    if (!shown) day.value = days - 1;
});

const { t } = useI18n();

const picked = computed(() =>
    selected
        ? {
              color: capabilityColor(selected.state),
              state: t(`workflows.capabilityState.${selected.state}`),
          }
        : null,
);

const FLASH = [
    { boxShadow: "0 0 0 0 var(--ui-text-highlighted)" },
    { boxShadow: "0 0 0 3px var(--ui-text-highlighted)" },
    { boxShadow: "0 0 0 0 var(--ui-text-highlighted)" },
];

const root = useTemplateRef("root");

const scrollToBlock = (capability: string) => {
    const card = root.value?.querySelector(`[id="block-${capability}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "center" });
    card?.animate(FLASH, { duration: 500, delay: 350, iterations: 2, easing: "ease-in-out" });
};
</script>
