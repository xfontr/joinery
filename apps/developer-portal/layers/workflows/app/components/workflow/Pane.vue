<template>
    <Transition
        :css="false"
        @before-enter="float"
        @enter="(el, done) => meld(el, done, true)"
        @leave="(el, done) => meld(el, done, false)"
    >
        <slot />
    </Transition>

    <UButton
        ref="button"
        icon="i-lucide-info"
        color="neutral"
        size="xl"
        square
        class="fixed right-6 bottom-12 z-60 hidden rounded-full shadow-lg transition duration-200 motion-reduce:transition-none xl:flex"
        :class="offered ? 'delay-300' : 'pointer-events-none scale-0 opacity-0'"
        :aria-label="$t('workflowPane.show')"
        :aria-hidden="!offered || undefined"
        :tabindex="offered ? undefined : -1"
        @click="emit('show')"
    />
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";

interface Props {
    /** Whether a block is picked while the pane is hidden, so the button stands in for it. */
    offered: boolean;
}

const { offered } = defineProps<Props>();
const emit = defineEmits<{ show: [] }>();

const button = useTemplateRef<ComponentPublicInstance>("button");

/** The curve of `page-reveal` in the design layer, so the pane opens the way the site switch does. */
const MELD = { duration: 450, easing: "cubic-bezier(0.7, 0, 0.2, 1)" };

// Floating over the board while it melds, so the board never slides and only the circle moves.
// Set before an opening pane is inserted, since one frame in the layout would rewrap the cards.
const float = (wrapper: Element) => {
    if (wrapper instanceof HTMLElement) wrapper.dataset.floating = "";
};
const land = (wrapper: Element) => {
    if (wrapper instanceof HTMLElement) delete wrapper.dataset.floating;
};

/** Grows the whole pane out of the button as a circle, or folds it back in. */
const meld = (wrapper: Element, done: () => void, opening: boolean) => {
    float(wrapper);
    const panel = wrapper.firstElementChild;
    const origin = (button.value?.$el as HTMLElement | undefined)?.getBoundingClientRect();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Below `xl` the wrapper isn't drawn, and the slide-over animates itself.
    if (
        !(wrapper instanceof HTMLElement) ||
        !panel ||
        !origin ||
        still ||
        getComputedStyle(wrapper).display === "none"
    ) {
        land(wrapper);
        done();
        return;
    }

    const box = panel.getBoundingClientRect();
    const x = origin.left + origin.width / 2 - box.left;
    const y = origin.top + origin.height / 2 - box.top;
    const radius = Math.hypot(Math.max(x, box.width - x), Math.max(y, box.height - y));
    const melding = panel.animate(
        [
            { clipPath: `circle(0 at ${x}px ${y}px)` },
            { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
        ],
        // A folded pane holds its last frame until Vue removes it, or it would flash back.
        { ...MELD, direction: opening ? "normal" : "reverse", fill: opening ? "none" : "forwards" },
    );

    void melding.finished
        .catch(() => undefined)
        .then(() => {
            // A folded pane stays afloat until Vue removes it; landing it would rewrap the cards.
            if (opening) land(wrapper);
            done();
        });
};
</script>
