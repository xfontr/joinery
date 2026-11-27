<template>
    <div class="flex flex-col gap-6">
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
                @select-stage="pickStage"
                @select="emit('select', $event)"
            />
        </div>

        <div class="flex flex-col gap-4">
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                <UTabs
                    v-model="view"
                    :items="views"
                    :content="false"
                    :aria-label="$t('workflowBoard.view')"
                    size="xs"
                    color="neutral"
                />
                <div class="ml-auto flex min-w-0 items-center gap-3">
                    <UInput
                        v-if="view === 'list'"
                        v-model="term"
                        icon="i-lucide-search"
                        :placeholder="$t('workflowBoard.search')"
                        :aria-label="$t('workflowBoard.search')"
                        size="sm"
                        class="w-56"
                    />
                    <p v-else-if="view === 'map'" class="text-xs text-muted">
                        {{ $t("workflowBoard.mapHint") }}
                    </p>
                </div>
            </div>

            <WorkflowStageCards
                v-if="view === 'cards' && activeStage"
                :stage="activeStage"
                :index="activeIndex"
                :selected="selected?.id ?? null"
                :activity="showActivity ? activity?.capabilities : null"
                :activity-peak="activity?.peak"
                @select="emit('select', $event)"
            />
            <WorkflowList
                v-else-if="view === 'list'"
                ref="list"
                :stages
                :term
                :selected="selected?.id ?? null"
                @select="emit('select', $event)"
            />
            <WorkflowGraph
                v-else-if="view === 'map'"
                :capabilities
                :stages
                :selected="selected?.id ?? null"
                @select="emit('select', $event)"
                @clear="emit('clear')"
            >
                <template v-if="$slots.aside" #aside><slot name="aside" /></template>
            </WorkflowGraph>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import type { CapabilityView, StageView } from "#layers/workflows/shared/workflows.ts";
import type { ProjectActivity } from "#layers/workflows/app/utils/workflowActivity.ts";

interface Props {
    stages: StageView[];
    /** Every block in the project, which the map lays out. */
    capabilities: CapabilityView[];
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

const {
    stages,
    capabilities,
    syncedStages,
    activeStage,
    activeIndex,
    selected,
    activity,
    days,
    dayLabel,
} = defineProps<Props>();
const emit = defineEmits<{
    selectStage: [stage: string];
    select: [capability: string];
    clear: [];
}>();
const day = defineModel<number>("day", { required: true });

defineSlots<{ summary?: () => unknown; aside?: () => unknown }>();

const term = ref("");

const list = useTemplateRef("list");
const pickStage = (stage: string) => {
    emit("selectStage", stage);
    list.value?.showStage(stage);
};
// The server has no saved choice, so the browser's copy is read only once hydration is done.
const showActivity = useLocalStorage("workflow-activity", false, { initOnMounted: true });

// Hidden, the replay can't be seen, so the board returns to today rather than staying on a past day.
watch(showActivity, (shown) => {
    if (!shown) day.value = days - 1;
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const VIEWS = ["cards", "list", "map"] as const;
const views = computed(() =>
    VIEWS.map((value) => ({ value, label: t(`workflowBoard.views.${value}`) })),
);

/** Kept in `?view=`, so a pasted link opens the view it was copied from. */
const view = computed({
    get: () => VIEWS.find((value) => value === route.query.view) ?? "cards",
    set: (value: string) =>
        void router.replace({
            query: { ...route.query, view: value === "cards" ? undefined : value },
        }),
});
</script>
