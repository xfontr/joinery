<template>
    <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div class="flex min-w-0 flex-1 flex-col gap-3">
            <WorkflowProgressMeter :percent="view.progress.percent" size="lg" class="max-w-md" />
            <div class="min-w-0">
                <p class="text-lg font-semibold">
                    {{
                        $t("workflowSummary.done", {
                            done: view.progress.done,
                            total: view.progress.total,
                        })
                    }}
                </p>
                <p class="text-sm tabular-nums">{{ points }}</p>
                <p class="text-sm text-muted">{{ view.project.summary }}</p>
                <p class="mt-0.5 flex flex-wrap gap-x-3 text-xs text-dimmed">
                    <span>{{ view.template.title }}</span>
                    <span>
                        {{ $t("workflowSummary.milestone", { milestone: view.project.milestone }) }}
                    </span>
                    <span class="tabular-nums">{{ tickets }}</span>
                    <code v-if="view.project.area" class="font-mono">{{ view.project.area }}</code>
                </p>
            </div>
        </div>
        <WorkflowLeft :blocks="view.left" :selected :blank @select="emit('select', $event)" />
    </div>
</template>

<script setup lang="ts">
import { formatPoints, type ProjectView } from "#layers/workflows/shared/workflows.ts";

interface Props {
    view: ProjectView;
    selected: string | null;
    blank: boolean;
}

const { view, selected, blank } = defineProps<Props>();
const emit = defineEmits<{ select: [capability: string] }>();

const { t } = useI18n();

const points = computed(() => {
    const { done, total, estimated, unestimated } = view.points;

    return [
        t("workflowSummary.points", { done: formatPoints(done), total: formatPoints(total) }),
        estimated > 0 ? t("workflowSummary.estimated", { points: formatPoints(estimated) }) : "",
        unestimated > 0 ? t("workflowSummary.unestimated", { count: unestimated }) : "",
    ]
        .filter(Boolean)
        .join(" · ");
});
const tickets = computed(() => {
    const { progress, tickets: count, project } = view;
    return t("workflowSummary.tickets", {
        blocks: progress.total,
        filed: count.filed,
        toFile: count.toFile[project.ticketSize],
    });
});
</script>
