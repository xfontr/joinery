<template>
    <svg
        data-glyph
        :width="map.width"
        :height="map.height"
        :viewBox="`0 0 ${map.width} ${map.height}`"
        role="img"
        :aria-label="label"
    >
        <path v-for="edge in map.edges" :key="edge.id" :d="edge.d" data-glyph-edge />
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
import type { WorkflowMap } from "./workflowMap";

interface Props {
    map: WorkflowMap;
    label: string;
}

defineProps<Props>();
</script>

<style>
[data-glyph] {
    max-width: 100%;
    height: auto;
    overflow: visible;
}

[data-glyph] [data-glyph-edge] {
    fill: none;
    stroke: var(--ui-text-muted);
    stroke-opacity: 0.4;
}

[data-glyph] rect {
    fill: var(--ui-primary);
}

[data-glyph] rect[data-tone="waiting"] {
    fill: var(--ui-bg);
    stroke: var(--ui-primary);
}
</style>
