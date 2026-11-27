<template>
    <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p class="flex flex-wrap gap-x-3 text-xs text-dimmed">
            <span>{{ view.template.title }}</span>
            <span class="tabular-nums">{{ tickets }}</span>
        </p>
        <WorkflowLeft :blocks="view.left" :selected :blank @select="emit('select', $event)" />
    </div>
</template>

<script setup lang="ts">
import type { ProjectView } from "#layers/workflows/shared/workflows.ts";

interface Props {
    view: ProjectView;
    selected: string | null;
    blank: boolean;
}

const { view, selected, blank } = defineProps<Props>();
const emit = defineEmits<{ select: [capability: string] }>();

const { t } = useI18n();

const tickets = computed(() => {
    const { tickets: count, project } = view;
    return t("workflowSummary.tickets", {
        filed: count.filed,
        total: count.filed + count.toFile[project.ticketSize],
    });
});
</script>
