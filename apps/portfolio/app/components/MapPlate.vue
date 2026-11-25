<template>
    <figure ref="plate" data-map-plate>
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
                data-node
            />
            <g v-for="note in notes" :key="note.id" aria-hidden="true" data-note>
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

const plate = useTemplateRef<HTMLElement>("plate");

/** The plan draws itself in order the first time it scrolls in; one already in view stays still. */
useMotion(plate, "scroll", ({ gsap, scope }) => {
    if (scope.getBoundingClientRect().top < window.innerHeight) return;

    const nodes = gsap.utils
        .toArray<SVGRectElement>("[data-node]", scope)
        .sort(
            (a, b) =>
                a.x.baseVal.value - b.x.baseVal.value || a.y.baseVal.value - b.y.baseVal.value,
        );

    gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: scope, start: "top 75%", once: true },
    })
        .from("[data-edge]", { drawSVG: 0, duration: 0.88, stagger: 0.02, ease: "power2.inOut" })
        .from(
            nodes,
            { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%", duration: 0.4, stagger: 0.024 },
            0.12,
        )
        .from("[data-note] [data-leader]", { drawSVG: 0, duration: 0.48 }, "-=0.16")
        .from("[data-note] text", { autoAlpha: 0, y: 6, duration: 0.32, stagger: 0.04 }, "-=0.24");
});

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
