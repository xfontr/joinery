<template>
    <figure class="flex max-w-sm flex-col gap-1">
        <figcaption
            class="self-end text-xs text-dimmed tabular-nums"
            :title="$t('workflowActivityStrip.tooltip')"
        >
            {{ lastCommit }}
        </figcaption>

        <div ref="track" class="scrollbar-none overflow-x-auto">
            <ol class="flex h-6 w-max items-end gap-px">
                <li
                    v-for="column in columns"
                    :key="column.day"
                    class="flex h-full w-1.5 shrink-0 flex-col-reverse"
                >
                    <span
                        v-for="segment in column.segments"
                        :key="segment.stage"
                        class="segment w-full first:rounded-b-xs last:rounded-t-xs"
                        :style="{ height: `${segment.share}%`, background: segment.color }"
                        :title="segment.label"
                    />
                </li>
            </ol>

            <ol class="flex w-max gap-px pt-1 text-xs text-dimmed" aria-hidden="true">
                <li v-for="column in columns" :key="column.day" class="w-1.5 shrink-0">
                    <span v-if="column.month" class="whitespace-nowrap">{{ column.month }}</span>
                </li>
            </ol>
        </div>
    </figure>
</template>

<script setup lang="ts">
import type { ProjectActivity } from "#layers/workflows/app/utils/workflowActivity.ts";
import type { StageView } from "#layers/workflows/shared/workflows.ts";

interface Props {
    activity: ProjectActivity;
    stages: StageView[];
}

const { activity, stages } = defineProps<Props>();

const { t } = useI18n();

const track = useTemplateRef("track");

/** Days keep a fixed width, so a timeline longer than the strip scrolls and opens on its latest day. */
const showLatest = (): void => {
    if (track.value) track.value.scrollLeft = track.value.scrollWidth;
};

onMounted(showLatest);
watch(
    () => activity.days.length,
    () => nextTick(showLatest),
);

const lastCommit = computed(() =>
    activity.lastDay ? calendarDay(activity.lastDay) : t("workflowActivityStrip.noCommits"),
);

/** A month gets a label on its first day, or at the start when at least a week of it is shown. */
const labelsMonth = (day: string, index: number): boolean => {
    if (day.endsWith("-01")) return true;
    if (index !== 0) return false;

    return activity.days.slice(0, 7).every((next) => next.slice(0, 7) === day.slice(0, 7));
};

/** Segments stack bottom to top in stage order, so a day's colours run the way the stages do. */
const columns = computed(() =>
    activity.days.map((day, index) => ({
        day,
        month: labelsMonth(day, index) ? calendarDay(day, "only") : null,
        segments: stages.flatMap((stage, stageIndex) => {
            const moved = activity.byStage[index]?.[stageIndex] ?? 0;

            return moved === 0
                ? []
                : [
                      {
                          stage: stage.id,
                          color: stageColor(stageIndex),
                          share: (moved / activity.busiest) * 100,
                          label: t("workflowActivityStrip.segment", {
                              stage: stage.title,
                              day: calendarDay(day),
                              moved: t("workflowActivityStrip.moved", moved),
                          }),
                      },
                  ];
        }),
    })),
);
</script>

<style scoped>
.segment {
    transition: filter 0.15s;
}

.segment:hover {
    filter: brightness(1.2) saturate(1.2);
}
</style>
