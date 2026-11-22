<template>
    <section class="flex flex-col gap-3">
        <div>
            <h2 class="text-xl font-semibold">How the pieces fit</h2>
            <p class="mt-1 text-sm text-muted">
                The repository groups applications, shared building blocks, and the tooling that
                supports them.
            </p>
        </div>

        <div class="grid gap-4 xl:grid-cols-3">
            <UCard v-for="group in groups" :key="group.label">
                <template #header>
                    <h3 class="font-semibold">{{ group.label }}</h3>
                </template>

                <p v-if="group.projects.length === 0" class="text-sm text-muted">
                    No projects in this group.
                </p>

                <div v-else class="flex flex-col gap-4">
                    <div
                        v-for="project in group.projects"
                        :key="project.name"
                        class="flex flex-col gap-2"
                    >
                        <div>
                            <p class="text-sm font-medium">{{ project.name }}</p>
                            <p class="font-mono text-xs text-dimmed">{{ project.root }}</p>
                        </div>

                        <div v-if="project.tags.length > 0" class="flex flex-wrap gap-1.5">
                            <UBadge
                                v-for="tag in project.tags"
                                :key="tag"
                                :label="tag"
                                color="neutral"
                                variant="subtle"
                                size="sm"
                                class="font-mono text-xs"
                            />
                        </div>

                        <div class="flex flex-col gap-0.5 text-xs text-muted">
                            <div v-if="project.uses">
                                <span class="text-dimmed">Uses:</span> {{ project.uses }}
                            </div>
                            <div v-if="project.usedBy">
                                <span class="text-dimmed">Used by:</span> {{ project.usedBy }}
                            </div>
                            <p v-if="!project.uses && !project.usedBy" class="text-dimmed">
                                No project relationships recorded.
                            </p>
                        </div>
                    </div>
                </div>
            </UCard>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";

interface Props {
    projects: ProjectNode[];
}

const { projects } = defineProps<Props>();

const withEdges = computed(() =>
    projects.map((project) => ({
        ...project,
        uses: project.dependsOn.join(", "),
        usedBy: project.dependedOnBy.join(", "),
    })),
);

const groups = computed(() => {
    const under = (prefix: string) =>
        withEdges.value.filter((project) => project.root.startsWith(prefix));
    return [
        { label: "Applications", projects: under("apps/") },
        { label: "Shared building blocks", projects: under("packages/") },
        {
            label: "Repository tooling",
            projects: withEdges.value.filter(
                ({ root }) => !root.startsWith("apps/") && !root.startsWith("packages/"),
            ),
        },
    ];
});
</script>
