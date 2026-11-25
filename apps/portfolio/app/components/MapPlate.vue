<template>
    <figure data-map-plate class="flex flex-col gap-4">
        <svg
            data-workflow-glyph
            :viewBox="`${-PAD} -16 ${map.width + PAD * 2} ${map.height + 32}`"
            role="img"
            :aria-label="label"
            class="w-full"
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
            <g v-for="note in notes" :key="note.id" aria-hidden="true">
                <path :d="note.line" data-leader />
                <rect :x="note.x - 8" :y="note.y - 8" width="16" height="16" data-leader />
                <text :x="note.textX" :y="note.textY" :text-anchor="note.anchor">
                    {{ note.title }}
                </text>
                <text
                    :x="note.textX"
                    :y="note.textY + 13"
                    :text-anchor="note.anchor"
                    data-note-tone
                >
                    {{ $t(`workflowProjectMap.legend.${note.tone}`) }}
                </text>
            </g>
        </svg>
        <figcaption class="font-mono text-meta text-muted">{{ label }}</figcaption>
    </figure>
</template>

<script setup lang="ts">
import type { MapNode } from "~/types/MapNode";
import type { ProjectMap } from "~/types/ProjectMap";

interface Props {
    map: ProjectMap;
    label: string;
}

const { map } = defineProps<Props>();

/** Room on each side of the glyph for the notes, in the glyph's own units. */
const PAD = 130;

/** The first block done, noted on the left, and the last block moving, noted on the right. */
const notes = computed(() => {
    const first = map.nodes.find((node) => node.tone === "done");
    const last = map.nodes.filter((node) => node.tone === "moving").at(-1);
    const picks: [MapNode | undefined, boolean][] = [
        [first, true],
        [last, false],
    ];

    return picks.flatMap(([node, left]) => {
        if (!node) return [];
        const x = node.x + map.nodeWidth / 2;
        const y = node.y + map.nodeHeight / 2;
        const out = left ? -24 : map.width + 24;
        const textY = y + (left ? 44 : 40);

        return {
            id: node.id,
            title: node.title,
            tone: node.tone,
            x,
            y,
            line: `M${x + (left ? -8 : 8)},${y} L${out},${y} L${out},${textY - 12}`,
            textX: out,
            textY,
            anchor: left ? "end" : "start",
        };
    });
});
</script>
