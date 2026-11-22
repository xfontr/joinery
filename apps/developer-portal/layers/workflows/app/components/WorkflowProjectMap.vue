<template>
    <figure data-workflow-map class="flex flex-col gap-4">
        <ol class="flex flex-col gap-6 md:hidden">
            <li v-for="stage in map.stages" :key="stage.id" class="flex flex-col gap-2">
                <span class="font-mono text-xs text-muted uppercase">{{ stage.title }}</span>
                <ul class="flex flex-col gap-1">
                    <li
                        v-for="block in stage.blocks"
                        :key="block.id"
                        :data-tone="block.tone"
                        class="flex items-baseline gap-2 text-sm"
                    >
                        <span aria-hidden="true" class="font-mono">{{ GLYPHS[block.tone] }}</span>
                        <span>{{ block.title }}</span>
                        <span class="sr-only"
                            >, {{ $t(`workflowProjectMap.legend.${block.tone}`) }}</span
                        >
                        <span v-if="block.owner" class="text-muted">
                            ◆
                            <span class="sr-only">{{ $t("workflowProjectMap.owner") }}</span>
                        </span>
                    </li>
                </ul>
            </li>
        </ol>

        <div class="hidden overflow-x-auto md:block">
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
                    <text x="10" y="19">{{ node.owner ? "◆ " : "" }}{{ node.label }}</text>
                </g>
            </svg>
        </div>

        <figcaption class="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
            <span v-for="(glyph, tone) in GLYPHS" :key="tone">
                {{ glyph }} {{ $t(`workflowProjectMap.legend.${tone}`) }}
            </span>
            <span>◆ {{ $t("workflowProjectMap.owner") }}</span>
        </figcaption>
    </figure>
</template>

<script setup lang="ts">
import type { ProjectMap } from "#layers/workflows/shared/workflows.ts";
import type { MapTone } from "#layers/workflows/shared/types/MapTone.ts";

interface Props {
    map: ProjectMap;
    label: string;
}

defineProps<Props>();

const GLYPHS = { done: "■", moving: "□", waiting: "⬚" } as const satisfies Record<MapTone, string>;
</script>
