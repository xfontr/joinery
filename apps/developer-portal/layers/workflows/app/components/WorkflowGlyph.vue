<template>
    <svg
        data-workflow-glyph
        :width="map.width"
        :height="map.height"
        :viewBox="`0 0 ${map.width} ${map.height}`"
        role="img"
        :aria-label="label"
    >
        <path v-for="edge in map.edges" :key="edge.id" :d="edge.d" data-edge />
        <rect
            v-for="node in map.nodes"
            :key="node.id"
            :x="node.x"
            :y="node.y"
            :width="map.nodeWidth"
            :height="map.nodeHeight"
            :data-tone="node.tone"
        />
    </svg>
</template>

<script setup lang="ts">
import type { ProjectMap } from "#layers/workflows/shared/workflows.ts";

interface Props {
    map: ProjectMap;
    label: string;
}

defineProps<Props>();
</script>
