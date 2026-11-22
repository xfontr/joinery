<template>
    <div class="flex flex-col gap-1.5">
        <span v-if="!legend && parts.length > 0" class="sr-only">{{ summary }}</span>
        <div v-if="parts.length > 0" class="flex h-1 gap-0.5 bg-muted" aria-hidden="true">
            <span
                v-for="part in visible"
                :key="part.label"
                class="h-full"
                :class="part.fill"
                :style="{ width: `${(part.value / total) * 100}%` }"
            />
        </div>
        <p v-if="legend && parts.length > 0" class="flex flex-wrap gap-x-3 text-xs text-muted">
            <span v-for="part in parts" :key="part.label">
                <span class="font-mono text-highlighted">{{ part.value }}</span>
                {{ part.label }}
            </span>
        </p>
    </div>
</template>

<script setup lang="ts">
import type { SplitPart } from "~/types/SplitPart";

interface Props {
    parts: SplitPart[];
    legend?: boolean;
}

const { parts, legend = true } = defineProps<Props>();

const FILL = {
    ink: "bg-inverted",
    soft: "bg-accented",
    good: "tone-good bg-current",
    warn: "tone-warn bg-current",
    bad: "tone-bad bg-current",
} as const;

const visible = computed(() =>
    parts
        .filter((part) => part.value > 0)
        .map((part) => ({ ...part, fill: FILL[part.tone ?? "ink"] })),
);

const total = computed(() =>
    Math.max(
        1,
        visible.value.reduce((sum, part) => sum + part.value, 0),
    ),
);

const summary = computed(() => parts.map((part) => `${part.value} ${part.label}`).join(", "));
</script>
