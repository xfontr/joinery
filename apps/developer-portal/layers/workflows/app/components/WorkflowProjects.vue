<template>
    <section class="flex flex-col gap-3">
        <h2 class="font-semibold">Projects</h2>

        <p v-if="projects.length === 0" class="text-sm text-muted">
            No project under <code class="font-mono">data/workflows/projects/</code> yet.
        </p>

        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <WorkflowCard v-for="view in projects" :key="view.project.id" :project="view" />
            <WorkflowNewProjectCard />
        </div>
    </section>
</template>

<script setup lang="ts">
import type { ProjectView } from "#layers/workflows/shared/workflows.ts";

interface Props {
    projects: ProjectView[];
}

const { projects } = defineProps<Props>();
</script>
