<template>
    <section class="flex flex-col gap-3">
        <h2 class="font-semibold">{{ $t("workflowProjects.title") }}</h2>

        <I18nT
            v-if="projects.length === 0"
            keypath="workflowProjects.empty"
            tag="p"
            scope="global"
            class="text-sm text-muted"
        >
            <template #folder>
                <code class="font-mono">{{ FOLDER }}</code>
            </template>
        </I18nT>

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

const FOLDER = "data/workflows/projects/";
</script>
