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
            class="pointer-events-none fixed top-0 left-0 z-50 w-72 border border-default bg-elevated p-4 shadow-lg"
            :style="placement"
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
import { useElementSize, useMediaQuery, useMouse, useWindowSize } from "@vueuse/core";

interface Props {
    /** What the pointer is over; `null` hides the card. */
    subject: Subject | null;
}

const { subject } = defineProps<Props>();

defineSlots<{ default(props: { subject: Subject | null }): unknown }>();

const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

const card = useTemplateRef<HTMLElement>("card");
const { width, height } = useElementSize(card);
const { x: pointerX, y: pointerY } = useMouse({ type: "client" });
const { width: viewportWidth, height: viewportHeight } = useWindowSize();

const shown = ref<Subject | null>(null);
const open = computed(() => finePointer.value && subject !== null);

/** A corner of the card always sits on the pointer; it flips to another corner near an edge. */
const placement = computed(() => {
    const left = pointerX.value + width.value > viewportWidth.value;
    const up = pointerY.value + height.value > viewportHeight.value;

    return {
        translate: `${left ? pointerX.value - width.value : pointerX.value}px ${
            up ? pointerY.value - height.value : pointerY.value
        }px`,
        transformOrigin: `${up ? "bottom" : "top"} ${left ? "right" : "left"}`,
    };
});

watch(
    () => subject,
    (next) => {
        if (next !== null) shown.value = next;
    },
);

watch(open, (hidden) => document.documentElement.toggleAttribute("data-cursor-hidden", hidden));

onBeforeUnmount(() => document.documentElement.removeAttribute("data-cursor-hidden"));
</script>
