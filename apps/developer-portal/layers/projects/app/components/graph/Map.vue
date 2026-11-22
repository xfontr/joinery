<template>
    <UCard variant="flush">
        <template #header>
            <h2 class="font-semibold">{{ $t("graphMap.title") }}</h2>
            <p class="text-xs text-muted">{{ $t("graphMap.lead") }}</p>
        </template>

        <p v-if="projects.length === 0" class="px-4 py-3 text-sm text-muted">
            {{ $t("graphMap.empty") }}
        </p>

        <div v-else class="overflow-x-auto">
            <div
                class="relative mx-auto"
                :style="{ width: `${map.width}px`, height: `${map.height}px` }"
            >
                <svg
                    class="absolute inset-0 overflow-visible"
                    :width="map.width"
                    :height="map.height"
                    aria-hidden="true"
                >
                    <defs>
                        <marker
                            :id="`map-arrow-${uid}`"
                            viewBox="0 0 10 10"
                            refX="9"
                            refY="5"
                            markerWidth="7"
                            markerHeight="7"
                            orient="auto-start-reverse"
                        >
                            <path d="M0,0 L10,5 L0,10 z" fill="var(--ui-text-muted)" />
                        </marker>
                    </defs>
                    <path
                        v-for="edge in map.edges"
                        :key="edge.key"
                        :d="edge.path"
                        fill="none"
                        stroke="var(--ui-text-muted)"
                        :stroke-width="touches(edge) ? 2 : 1.25"
                        :opacity="!hovered || touches(edge) ? 0.8 : 0.15"
                        :marker-end="`url(#map-arrow-${uid})`"
                    />
                </svg>

                <NuxtLink
                    v-for="node in nodes"
                    :key="node.name"
                    :to="node.to"
                    class="absolute flex flex-col justify-center gap-0.5 rounded-lg border border-default bg-default px-3 transition hover:border-inverted"
                    :style="{
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        width: `${MAP_NODE_WIDTH}px`,
                        height: `${MAP_NODE_HEIGHT}px`,
                    }"
                    @mouseenter="hovered = node.name"
                    @mouseleave="hovered = null"
                    @focus="hovered = node.name"
                    @blur="hovered = null"
                >
                    <span class="truncate text-xs font-semibold text-highlighted">
                        {{ node.label }}
                    </span>
                    <span class="truncate font-mono text-xs text-dimmed">{{ node.type }}</span>
                </NuxtLink>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import {
    architectureMap,
    MAP_NODE_HEIGHT,
    MAP_NODE_WIDTH,
} from "#layers/projects/app/utils/architectureMap.ts";

interface Props {
    projects: ProjectNode[];
}

const { projects } = defineProps<Props>();

const uid = useId();
const map = computed(() => architectureMap(projects));
const nodes = computed(() =>
    map.value.nodes.map(({ project, x, y }) => ({
        name: project.name,
        label: folderOf(project.name),
        type: project.tags.find((tag) => tag.startsWith("type:")),
        to: `/projects/${folderOf(project.root)}`,
        x,
        y,
    })),
);
const hovered = ref<string | null>(null);

const touches = ({ from, to }: { from: string; to: string }) =>
    hovered.value === from || hovered.value === to;
</script>
