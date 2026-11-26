<template>
    <h1
        ref="statement"
        class="text-hero text-highlighted"
        @pointermove="lift?.($event)"
        @pointerleave="settle?.()"
    >
        <span data-line class="block">{{ title }}</span>
        <span data-line class="block">
            <mark>{{ mark }}</mark>
        </span>
    </h1>
</template>

<script setup lang="ts">
import { SplitText } from "gsap/SplitText";

interface Props {
    title: string;
    /** The statement's last words, set in the accent on a line of their own. */
    mark: string;
}

defineProps<Props>();

/** How high the letter under the pointer rises, as a share of its line's height. */
const RISE = 0.09;

const statement = useTemplateRef<HTMLElement>("statement");
const lift = shallowRef<(event: PointerEvent) => void>();
const settle = shallowRef<() => void>();

/** The letters near the pointer rise, falling off with distance, and settle when it leaves. */
useMotion(statement, "pointer", ({ gsap, scope }) => {
    const split = SplitText.create(scope, { type: "words,chars", tag: "span", aria: "auto" });
    const letters = split.chars.map((char) => ({
        element: char,
        y: gsap.quickTo(char, "y", { duration: 0.5, ease: "power3" }),
    }));

    /** Centres in page coordinates, so a scroll between two moves doesn't stale them. */
    let centres: { x: number; y: number }[] = [];
    let reach = 0;
    let rise = 0;

    const measure = () => {
        centres = letters.map(({ element }) => {
            const box = element.getBoundingClientRect();
            return { x: box.left + box.width / 2, y: box.top + box.height / 2 + window.scrollY };
        });
        const height = (letters[0]?.element as HTMLElement | undefined)?.offsetHeight ?? 0;
        reach = height * 1.6;
        rise = height * RISE;
    };

    lift.value = (event) => {
        if (event.pointerType !== "mouse") return;
        if (!centres.length) measure();

        const pointerY = event.clientY + window.scrollY;
        letters.forEach(({ y }, index) => {
            const centre = centres[index]!;
            const distance = Math.hypot(centre.x - event.clientX, centre.y - pointerY);
            const near = Math.max(0, 1 - distance / reach);
            y(-near * near * rise);
        });
    };

    settle.value = () => {
        centres = [];
        for (const { y } of letters) y(0);
    };

    return () => {
        lift.value = undefined;
        settle.value = undefined;
    };
});
</script>
