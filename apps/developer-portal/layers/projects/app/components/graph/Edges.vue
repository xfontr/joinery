<template>
    <UCard variant="flush">
        <template #header>
            <h2 class="font-semibold">Tags and edges</h2>
            <p class="text-xs text-muted">
                What the picture does not answer: which tags a project carries, and what breaks if
                it changes.
            </p>
        </template>

        <div class="divide-y divide-default">
            <div
                v-for="project in rows"
                :key="project.name"
                class="flex items-start gap-4 px-4 py-3"
            >
                <div class="w-56 shrink-0">
                    <div class="text-sm font-medium">{{ project.name }}</div>
                    <div class="font-mono text-xs text-dimmed">{{ project.root }}</div>
                </div>

                <div class="flex w-56 shrink-0 flex-wrap gap-1.5">
                    <UBadge
                        v-for="tag in project.tags"
                        :key="tag.label"
                        :color="tag.color"
                        variant="subtle"
                        size="sm"
                        class="font-mono text-xs"
                        :label="tag.label"
                    />
                </div>

                <div class="flex min-w-0 flex-1 flex-col gap-0.5 text-xs text-muted">
                    <div v-if="project.uses" class="truncate">
                        <span class="text-dimmed">uses </span>{{ project.uses }}
                    </div>
                    <div v-if="project.usedBy" class="truncate">
                        <span class="text-dimmed">used by </span>{{ project.usedBy }}
                    </div>
                    <div v-if="!project.uses && !project.usedBy" class="text-dimmed">leaf</div>
                </div>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";

interface Props {
    projects: ProjectNode[];
}

const { projects } = defineProps<Props>();

const tagColor = (label: string): "primary" | "neutral" =>
    label.startsWith("type:") ? "primary" : "neutral";

const rows = computed(() =>
    projects.map((project) => ({
        name: project.name,
        root: project.root,
        tags: project.tags.map((label) => ({ label, color: tagColor(label) })),
        uses: project.dependsOn.join(", "),
        usedBy: project.dependedOnBy.join(", "),
    })),
);
</script>
