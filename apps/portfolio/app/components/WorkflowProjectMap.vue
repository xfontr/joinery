<template>
    <figure data-workflow-map>
        <ol class="flex flex-col gap-6 md:hidden">
            <li v-for="stage in map.stages" :key="stage.id" class="flex flex-col gap-2">
                <span class="font-mono text-meta text-muted uppercase">{{ stage.title }}</span>
                <ul class="flex flex-col gap-1">
                    <li
                        v-for="block in stage.blocks"
                        :key="block.id"
                        :data-tone="block.tone"
                        class="flex items-baseline gap-2 text-base"
                    >
                        <span aria-hidden="true" class="font-mono">{{ GLYPHS[block.tone] }}</span>
                        <span>{{ block.title }}</span>
                        <span class="sr-only"
                            >, {{ $t(`workflowProjectMap.legend.${block.tone}`) }}</span
                        >
                        <span v-if="block.owner" class="sr-only"
                            >, {{ $t("workflowProjectMap.owner") }}</span
                        >
                    </li>
                </ul>
            </li>
        </ol>

        <!-- A map wider than the page scrolls, so a keyboard has to be able to reach it -->
        <div tabindex="0" role="region" :aria-label="label" class="hidden overflow-x-auto md:block">
            <svg
                :width="map.width"
                :height="map.height"
                :viewBox="`0 0 ${map.width} ${map.height}`"
                role="img"
                :aria-label="label"
                class="font-mono text-xs"
            >
                <text v-for="stage in map.stages" :key="stage.id" :x="stage.x" y="14" data-column>
                    {{ stage.title }}
                </text>
                <path v-for="edge in map.edges" :key="edge.id" :d="edge.d" data-edge />
                <g
                    v-for="node in map.nodes"
                    :key="node.id"
                    :transform="`translate(${node.x} ${node.y})`"
                    :data-tone="node.tone"
                >
                    <title>{{ node.title }}</title>
                    <rect :width="map.nodeWidth" :height="map.nodeHeight" />
                    <text x="10" y="19">{{ node.label }}</text>
                </g>
            </svg>
        </div>
    </figure>
</template>

<script setup lang="ts">
import type { ProjectMap } from "~/types/ProjectMap";
import type { MapTone } from "~/types/MapTone";

interface Props {
    map: ProjectMap;
    label: string;
}

defineProps<Props>();

const GLYPHS = { done: "■", moving: "□", waiting: "⬚" } as const satisfies Record<MapTone, string>;
</script>
