<template>
    <div class="mt-1 flex flex-col gap-3">
        <p v-if="view.project.summary" class="text-sm text-muted">{{ view.project.summary }}</p>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
            <WorkflowProgressMeter :percent="view.progress.percent" class="w-56" />
            <p class="text-sm tabular-nums">{{ done }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatPoints, type ProjectView } from "#layers/workflows/shared/workflows.ts";

interface Props {
    view: ProjectView;
}

const { view } = defineProps<Props>();

const { t } = useI18n();

const done = computed(() => {
    const { progress, points } = view;
    const line = t("workflowSummary.done", {
        done: progress.done,
        total: progress.total,
        points: t("workflowSummary.points", {
            done: formatPoints(points.done),
            total: formatPoints(points.total),
        }),
    });

    return points.unestimated > 0
        ? `${line} · ${t("workflowSummary.unestimated", { count: points.unestimated })}`
        : line;
});
</script>
