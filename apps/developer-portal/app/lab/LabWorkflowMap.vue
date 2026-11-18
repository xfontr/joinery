<template>
    <figure data-map class="flex flex-col gap-3">
        <div class="overflow-x-auto">
            <svg
                :width="map.width"
                :height="map.height"
                :viewBox="`0 0 ${map.width} ${map.height}`"
                role="img"
                :aria-label="label"
            >
                <text
                    v-for="column in map.columns"
                    :key="column.title"
                    :x="column.x"
                    y="14"
                    data-map-column
                >
                    {{ column.title }}
                </text>
                <path v-for="edge in map.edges" :key="edge.id" :d="edge.d" data-map-edge />
                <g
                    v-for="node in map.nodes"
                    :key="node.id"
                    :transform="`translate(${node.x} ${node.y})`"
                    :data-tone="node.tone"
                >
                    <rect :width="map.nodeWidth" :height="map.nodeHeight" />
                    <text x="10" y="19">{{ node.owner ? "◆ " : "" }}{{ node.title }}</text>
                </g>
            </svg>
        </div>
        <figcaption class="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
            <span>■ done</span>
            <span>□ moving now</span>
            <span>⬚ waiting on another block</span>
            <span>◆ the owner's call</span>
        </figcaption>
    </figure>
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
[data-map] svg {
    font-family: var(--font-mono);
    font-size: 12px;
}

[data-map] [data-map-column] {
    fill: var(--ui-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

[data-map] [data-map-edge] {
    fill: none;
    stroke: var(--ui-text-muted);
    stroke-opacity: 0.35;
}

[data-map] [data-tone="done"] rect {
    fill: var(--ui-primary);
}

[data-map] [data-tone="done"] text {
    fill: var(--ui-bg);
}

[data-map] [data-tone="moving"] rect {
    fill: var(--ui-bg-elevated);
    stroke: var(--ui-primary);
    stroke-width: 2;
}

[data-map] [data-tone="moving"] text {
    fill: var(--ui-text-highlighted);
}

[data-map] [data-tone="waiting"] rect {
    fill: var(--ui-bg);
    stroke: var(--ui-border-accented);
    stroke-dasharray: 4 3;
}

[data-map] [data-tone="waiting"] text {
    fill: var(--ui-text-muted);
}
</style>
