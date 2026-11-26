<template>
    <Transition
        enter-active-class="transition duration-150 ease-out"
        leave-active-class="transition duration-100 ease-in"
        enter-from-class="opacity-0 motion-safe:scale-95"
        leave-to-class="opacity-0 motion-safe:scale-95"
    >
        <div
            v-if="open"
            ref="card"
            data-cursor-preview
            aria-hidden="true"
            class="pointer-events-none fixed top-0 left-0 z-50 w-72 border border-default bg-elevated p-4 shadow-lg will-change-transform"
        >
            <Transition
                mode="out-in"
                enter-active-class="transition-opacity duration-100"
                leave-active-class="transition-opacity duration-75"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
            >
                <div :key="shown ?? ''">
                    <slot :subject="shown" />
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<script setup lang="ts" generic="Subject extends string">
import { useElementSize, useEventListener, useMediaQuery } from "@vueuse/core";

interface Props {
    /** What the pointer is over; `null` hides the card. */
    subject: Subject | null;
}

const { subject } = defineProps<Props>();

defineSlots<{ default(props: { subject: Subject | null }): unknown }>();

const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

const card = useTemplateRef<HTMLElement>("card");
const { width, height } = useElementSize(card);

const shown = ref<Subject | null>(null);
/** A scroll fires no `pointerleave`, so the subject stays stale until the pointer next moves. */
const scrolled = ref(false);
const open = computed(() => finePointer.value && subject !== null && !scrolled.value);

const pointer = { x: 0, y: 0 };
let frame = 0;

/**
 * A corner of the card always sits on the pointer; it flips to another corner near an edge.
 * Written straight to the element, since a re-render per `pointermove` re-runs the slot too.
 */
const place = () => {
    frame = 0;
    const element = card.value;
    if (!element) return;

    const left = pointer.x + width.value > window.innerWidth;
    const up = pointer.y + height.value > window.innerHeight;

    element.style.transform = `translate(${left ? pointer.x - width.value : pointer.x}px, ${
        up ? pointer.y - height.value : pointer.y
    }px)`;
    element.style.transformOrigin = `${up ? "bottom" : "top"} ${left ? "right" : "left"}`;
};

useEventListener(
    "pointermove",
    (event: PointerEvent) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        scrolled.value = false;
        if (card.value && !frame) frame = requestAnimationFrame(place);
    },
    { passive: true },
);

useEventListener("scroll", () => (scrolled.value = true), { passive: true });

watch([card, width, height], place, { flush: "post" });

watch(
    () => subject,
    (next) => {
        if (next !== null) shown.value = next;
    },
);

watch(open, (hidden) => document.documentElement.toggleAttribute("data-cursor-hidden", hidden));

onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
    document.documentElement.removeAttribute("data-cursor-hidden");
});
</script>
