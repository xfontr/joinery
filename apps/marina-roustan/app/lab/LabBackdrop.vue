<template>
    <svg
        v-if="variant !== 'ninguno'"
        aria-hidden="true"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        class="pointer-events-none absolute inset-0 -z-10 size-full"
        :class="{ 'mask-b-from-60%': faded }"
        fill="none"
    >
        <g v-if="variant === 'ondas'" class="text-primary opacity-25" stroke="currentColor">
            <circle v-for="r in ripples" :key="r" cx="1320" cy="860" :r stroke-width="1" />
            <circle v-for="r in smallRipples" :key="`b${r}`" cx="60" cy="-80" :r stroke-width="1" />
        </g>

        <g v-else-if="variant === 'relieve'" class="text-primary opacity-25" stroke="currentColor">
            <path v-for="(d, index) in contours" :key="index" :d stroke-width="1" />
        </g>

        <g v-else-if="variant === 'bruma'" :filter="`url(#${blurId})`">
            <defs>
                <filter :id="blurId" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="90" />
                </filter>
            </defs>
            <circle cx="180" cy="160" r="320" class="text-primary opacity-30" fill="currentColor" />
            <circle
                cx="1220"
                cy="120"
                r="260"
                class="text-primary opacity-20"
                fill="currentColor"
            />
            <circle
                cx="1180"
                cy="700"
                r="300"
                class="text-secondary opacity-15"
                fill="currentColor"
            />
        </g>

        <g v-else-if="variant === 'hilo'" stroke="currentColor" stroke-linecap="round">
            <path
                d="M-40 720 C 260 640, 420 800, 720 740 S 1160 600, 1480 690"
                class="text-secondary opacity-50"
                stroke-width="1.5"
            />
            <path
                d="M-40 760 C 300 690, 460 830, 760 780 S 1180 650, 1480 740"
                class="text-primary opacity-30"
                stroke-width="1"
            />
        </g>

        <g v-else-if="variant === 'agua'" class="text-primary opacity-30" stroke="currentColor">
            <line
                v-for="(y, index) in waterline"
                :key="y"
                x1="0"
                :y1="y"
                x2="1440"
                :y2="y"
                :stroke-width="0.6 + index * 0.12"
            />
        </g>
    </svg>
</template>

<script setup lang="ts">
import type { BackdropVariant } from "./backdrop";

interface Props {
    variant: BackdropVariant;
}

const props = defineProps<Props>();

const faded = computed(() => ["ondas", "relieve", "bruma"].includes(props.variant));

const blurId = useId();

const ripples = Array.from({ length: 12 }, (_, index) => 110 + index * 95);
const smallRipples = ripples.slice(0, 5);

const contour = (ring: number, cx: number, cy: number) => {
    const base = 70 + ring * 46;
    const points = Array.from({ length: 121 }, (_, step) => {
        const angle = (step / 120) * Math.PI * 2;
        const wobble =
            1 + 0.13 * Math.sin(3 * angle + ring * 0.45) + 0.06 * Math.sin(5 * angle - ring * 0.8);
        const radius = base * wobble;
        return `${(cx + Math.cos(angle) * radius * 1.35).toFixed(1)} ${(cy + Math.sin(angle) * radius).toFixed(1)}`;
    });
    return `M${points.join(" L")}Z`;
};

const contours = [
    ...Array.from({ length: 11 }, (_, ring) => contour(ring, 1240, 640)),
    ...Array.from({ length: 6 }, (_, ring) => contour(ring, 120, 60)),
];

const waterline = Array.from({ length: 9 }, (_, index) => 690 + 110 * (1 - 0.8 ** index));
</script>
