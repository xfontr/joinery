<template>
    <NuxtLink
        :to="`/workflows/${card.id}`"
        class="flex flex-col gap-3 border border-default bg-default p-4 transition-colors hover:bg-elevated"
    >
        <div class="min-w-0">
            <p class="truncate font-semibold text-highlighted">{{ card.title }}</p>
            <p class="truncate text-xs text-muted">{{ card.templateTitle }}</p>
        </div>
        <WorkflowProgressMeter :percent="card.percent" />
        <p class="text-xs text-muted tabular-nums">{{ card.done }}</p>
    </NuxtLink>
</template>

<script setup lang="ts">
import { projectCard, type ProjectView } from "#layers/workflows/shared/workflows.ts";

interface Props {
    project: ProjectView;
}

const { project } = defineProps<Props>();

const card = computed(() => projectCard(project));
</script>
