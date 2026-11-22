<template>
    <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div class="flex min-w-0 flex-1 flex-col gap-3">
            <WorkflowProgressMeter :percent="view.progress.percent" size="lg" class="max-w-md" />
            <div class="min-w-0">
                <p class="text-lg font-semibold">
                    {{ view.progress.done }} of {{ view.progress.total }} done
                </p>
                <p class="text-sm tabular-nums">{{ points }}</p>
                <p class="text-sm text-muted">{{ view.project.summary }}</p>
                <p class="mt-0.5 flex flex-wrap gap-x-3 text-xs text-dimmed">
                    <span>{{ view.template.title }}</span>
                    <span>Milestone {{ view.project.milestone }}</span>
                    <span class="tabular-nums">{{ tickets }}</span>
                    <code v-if="view.project.area" class="font-mono">{{ view.project.area }}</code>
                </p>
            </div>
        </div>
        <WorkflowLeft :blocks="view.left" :selected :blank @select="emit('select', $event)" />
    </div>
</template>

<script setup lang="ts">
import { pointsLine, type ProjectView } from "#layers/workflows/shared/workflows.ts";

interface Props {
    view: ProjectView;
    selected: string | null;
    blank: boolean;
}

const { view, selected, blank } = defineProps<Props>();
const emit = defineEmits<{ select: [capability: string] }>();

const points = computed(() => pointsLine(view.points));
const tickets = computed(() => {
    const { progress, tickets: count, project } = view;
    return `${progress.total} blocks · ${count.filed} tickets filed · ${count.toFile[project.ticketSize]} to file`;
});
</script>
