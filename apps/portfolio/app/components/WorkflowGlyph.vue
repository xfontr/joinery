<template>
    <figure ref="plate">
        <svg
            data-workflow-glyph
            :viewBox="annotated ? '-130 -16 582 320' : '0 0 322 288'"
            role="img"
            :aria-label="$t('workflowTeaser.glyphLabel')"
            class="w-full"
        >
            <path d="M10 37 C20 37 -10 85 0 85" data-edge />
            <path d="M10 53 C20 53 -10 85 0 85" data-edge />
            <path d="M10 69 C20 69 -10 85 0 85" data-edge />
            <path d="M62 5 C72 5 42 21 52 21" data-edge />
            <path d="M62 21 C72 21 42 37 52 37" data-edge />
            <path d="M10 5 C31 5 31 37 52 37" data-edge />
            <path d="M10 37 C31 37 31 37 52 37" data-edge />
            <path d="M62 37 C72 37 42 53 52 53" data-edge />
            <path d="M62 37 C72 37 42 69 52 69" data-edge />
            <path d="M62 53 C72 53 42 69 52 69" data-edge />
            <path d="M62 69 C72 69 42 85 52 85" data-edge />
            <path d="M114 5 C124 5 94 21 104 21" data-edge />
            <path d="M114 5 C124 5 94 37 104 37" data-edge />
            <path d="M114 5 C124 5 94 53 104 53" data-edge />
            <path d="M114 5 C124 5 94 69 104 69" data-edge />
            <path d="M10 5 C57 5 57 69 104 69" data-edge />
            <path d="M10 85 C57 85 57 69 104 69" data-edge />
            <path d="M114 101 C124 101 94 85 104 85" data-edge />
            <path d="M114 69 C124 69 94 101 104 101" data-edge />
            <path d="M10 85 C57 85 57 101 104 101" data-edge />
            <path d="M114 101 C124 101 94 117 104 117" data-edge />
            <path d="M62 85 C109 85 109 5 156 5" data-edge />
            <path d="M114 21 C135 21 135 5 156 5" data-edge />
            <path d="M114 69 C135 69 135 5 156 5" data-edge />
            <path d="M166 5 C176 5 146 21 156 21" data-edge />
            <path d="M114 101 C135 101 135 21 156 21" data-edge />
            <path d="M166 69 C176 69 146 37 156 37" data-edge />
            <path d="M166 21 C176 21 146 53 156 53" data-edge />
            <path d="M166 69 C176 69 146 53 156 53" data-edge />
            <path d="M166 5 C176 5 146 69 156 69" data-edge />
            <path d="M166 5 C176 5 146 85 156 85" data-edge />
            <path d="M114 101 C135 101 135 85 156 85" data-edge />
            <path d="M166 133 C176 133 146 101 156 101" data-edge />
            <path d="M166 133 C176 133 146 117 156 117" data-edge />
            <path d="M10 85 C83 85 83 133 156 133" data-edge />
            <path d="M166 5 C176 5 146 133 156 133" data-edge />
            <path d="M166 133 C176 133 146 149 156 149" data-edge />
            <path d="M166 5 C176 5 146 149 156 149" data-edge />
            <path d="M10 85 C83 85 83 165 156 165" data-edge />
            <path d="M166 5 C176 5 146 165 156 165" data-edge />
            <path d="M114 69 C135 69 135 181 156 181" data-edge />
            <path d="M10 85 C83 85 83 181 156 181" data-edge />
            <path d="M114 69 C135 69 135 197 156 197" data-edge />
            <path d="M166 5 C176 5 146 213 156 213" data-edge />
            <path d="M166 21 C176 21 146 213 156 213" data-edge />
            <path d="M166 37 C176 37 146 213 156 213" data-edge />
            <path d="M166 53 C176 53 146 213 156 213" data-edge />
            <path d="M166 69 C176 69 146 213 156 213" data-edge />
            <path d="M166 85 C176 85 146 213 156 213" data-edge />
            <path d="M166 101 C176 101 146 213 156 213" data-edge />
            <path d="M166 117 C176 117 146 213 156 213" data-edge />
            <path d="M166 133 C176 133 146 213 156 213" data-edge />
            <path d="M166 149 C176 149 146 213 156 213" data-edge />
            <path d="M166 165 C176 165 146 213 156 213" data-edge />
            <path d="M166 181 C176 181 146 213 156 213" data-edge />
            <path d="M114 5 C135 5 135 213 156 213" data-edge />
            <path d="M166 197 C176 197 146 213 156 213" data-edge />
            <path d="M166 229 C176 229 146 213 156 213" data-edge />
            <path d="M166 245 C176 245 146 213 156 213" data-edge />
            <path d="M166 261 C176 261 146 213 156 213" data-edge />
            <path d="M166 277 C176 277 146 213 156 213" data-edge />
            <path d="M166 5 C176 5 146 229 156 229" data-edge />
            <path d="M114 101 C135 101 135 229 156 229" data-edge />
            <path d="M166 149 C176 149 146 229 156 229" data-edge />
            <path d="M166 5 C176 5 146 245 156 245" data-edge />
            <path d="M114 101 C135 101 135 245 156 245" data-edge />
            <path d="M166 5 C176 5 146 261 156 261" data-edge />
            <path d="M114 101 C135 101 135 261 156 261" data-edge />
            <path d="M166 5 C176 5 146 277 156 277" data-edge />
            <path d="M114 101 C135 101 135 277 156 277" data-edge />
            <path d="M114 85 C161 85 161 5 208 5" data-edge />
            <path d="M166 53 C187 53 187 5 208 5" data-edge />
            <path d="M166 5 C187 5 187 21 208 21" data-edge />
            <path d="M114 101 C161 101 161 37 208 37" data-edge />
            <path d="M166 213 C187 213 187 53 208 53" data-edge />
            <path d="M166 53 C187 53 187 69 208 69" data-edge />
            <path d="M114 101 C161 101 161 85 208 85" data-edge />
            <path d="M166 53 C187 53 187 101 208 101" data-edge />
            <path d="M10 21 C135 21 135 5 260 5" data-edge />
            <path d="M218 69 C239 69 239 5 260 5" data-edge />
            <path d="M166 213 C213 213 213 21 260 21" data-edge />
            <path d="M218 53 C239 53 239 21 260 21" data-edge />
            <path d="M218 69 C239 69 239 21 260 21" data-edge />
            <path d="M218 5 C239 5 239 21 260 21" data-edge />
            <path d="M218 37 C239 37 239 21 260 21" data-edge />
            <path d="M218 21 C239 21 239 21 260 21" data-edge />
            <path d="M270 5 C280 5 250 21 260 21" data-edge />
            <path d="M218 101 C239 101 239 21 260 21" data-edge />
            <path d="M114 53 C187 53 187 21 260 21" data-edge />
            <path d="M166 181 C213 181 213 21 260 21" data-edge />
            <path d="M218 85 C239 85 239 21 260 21" data-edge />
            <path d="M10 5 C135 5 135 21 260 21" data-edge />
            <path d="M10 85 C135 85 135 21 260 21" data-edge />
            <path d="M166 85 C213 85 213 21 260 21" data-edge />
            <path d="M166 101 C213 101 213 21 260 21" data-edge />
            <path d="M166 117 C213 117 213 21 260 21" data-edge />
            <path d="M166 149 C213 149 213 21 260 21" data-edge />
            <path d="M166 165 C213 165 213 21 260 21" data-edge />
            <path d="M114 5 C187 5 187 21 260 21" data-edge />
            <path d="M270 21 C280 21 250 37 260 37" data-edge />
            <path d="M270 37 C280 37 250 53 260 53" data-edge />
            <path d="M270 53 C291 53 291 5 312 5" data-edge />
            <rect x="0" y="0" width="10" height="10" data-tone="done" data-node />
            <rect x="0" y="16" width="10" height="10" data-tone="done" data-node />
            <rect x="0" y="32" width="10" height="10" data-tone="done" data-node />
            <rect x="0" y="48" width="10" height="10" data-tone="done" data-node />
            <rect x="0" y="64" width="10" height="10" data-tone="done" data-node />
            <rect x="0" y="80" width="10" height="10" data-tone="done" data-node />
            <rect x="52" y="0" width="10" height="10" data-tone="done" data-node />
            <rect x="52" y="16" width="10" height="10" data-tone="done" data-node />
            <rect x="52" y="32" width="10" height="10" data-tone="done" data-node />
            <rect x="52" y="48" width="10" height="10" data-tone="done" data-node />
            <rect x="52" y="64" width="10" height="10" data-tone="done" data-node />
            <rect x="52" y="80" width="10" height="10" data-tone="done" data-node />
            <rect x="104" y="0" width="10" height="10" data-tone="done" data-node />
            <rect x="104" y="16" width="10" height="10" data-tone="done" data-node />
            <rect x="104" y="32" width="10" height="10" data-tone="done" data-node />
            <rect x="104" y="48" width="10" height="10" data-tone="done" data-node />
            <rect x="104" y="64" width="10" height="10" data-tone="done" data-node />
            <rect x="104" y="80" width="10" height="10" data-tone="done" data-node />
            <rect x="104" y="96" width="10" height="10" data-tone="done" data-node />
            <rect x="104" y="112" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="0" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="16" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="32" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="48" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="64" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="80" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="96" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="112" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="128" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="144" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="160" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="176" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="192" width="10" height="10" data-tone="moving" data-node />
            <rect x="156" y="208" width="10" height="10" data-tone="moving" data-node />
            <rect x="156" y="224" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="240" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="256" width="10" height="10" data-tone="done" data-node />
            <rect x="156" y="272" width="10" height="10" data-tone="done" data-node />
            <rect x="208" y="0" width="10" height="10" data-tone="done" data-node />
            <rect x="208" y="16" width="10" height="10" data-tone="done" data-node />
            <rect x="208" y="32" width="10" height="10" data-tone="done" data-node />
            <rect x="208" y="48" width="10" height="10" data-tone="done" data-node />
            <rect x="208" y="64" width="10" height="10" data-tone="done" data-node />
            <rect x="208" y="80" width="10" height="10" data-tone="moving" data-node />
            <rect x="208" y="96" width="10" height="10" data-tone="moving" data-node />
            <rect x="260" y="0" width="10" height="10" data-tone="done" data-node />
            <rect x="260" y="16" width="10" height="10" data-tone="done" data-node />
            <rect x="260" y="32" width="10" height="10" data-tone="done" data-node />
            <rect x="260" y="48" width="10" height="10" data-tone="done" data-node />
            <rect x="312" y="0" width="10" height="10" data-tone="done" data-node />

            <template v-if="annotated">
                <g aria-hidden="true" data-note>
                    <path d="M-3 5h-21v32" data-leader />
                    <rect x="-3" y="-3" width="16" height="16" data-leader />
                    <text x="-24" y="49" text-anchor="end">
                        {{ $t("workflowTeaser.notes.first") }}
                    </text>
                    <text x="-24" y="62" text-anchor="end" data-note-tone>
                        {{ $t("workflowProjectMap.legend.done") }}
                    </text>
                </g>
                <g aria-hidden="true" data-note>
                    <path d="M221 101h125v28" data-leader />
                    <rect x="205" y="93" width="16" height="16" data-leader />
                    <text x="346" y="141">{{ $t("workflowTeaser.notes.last") }}</text>
                    <text x="346" y="154" data-note-tone>
                        {{ $t("workflowProjectMap.legend.moving") }}
                    </text>
                </g>
            </template>
        </svg>
    </figure>
</template>

<script setup lang="ts">
interface Props {
    /** Adds the two notes beside the plan, for when it has room. */
    annotated?: boolean;
}

const { annotated = false } = defineProps<Props>();

const plate = useTemplateRef<HTMLElement>("plate");

/** The plan draws itself in order the first time it scrolls in; one already in view stays still. */
useMotion(plate, "scroll", ({ gsap, scope }) => {
    if (!annotated || scope.getBoundingClientRect().top < window.innerHeight) return;

    gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: scope, start: "top 75%", once: true },
    })
        .from("[data-edge]", { drawSVG: 0, duration: 0.88, stagger: 0.02, ease: "power2.inOut" })
        .from(
            "[data-node]",
            { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%", duration: 0.4, stagger: 0.024 },
            0.12,
        )
        .from("[data-note] [data-leader]", { drawSVG: 0, duration: 0.48 }, "-=0.16")
        .from("[data-note] text", { autoAlpha: 0, y: 6, duration: 0.32, stagger: 0.04 }, "-=0.24");
});
</script>
