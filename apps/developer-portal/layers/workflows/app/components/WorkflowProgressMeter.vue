<template>
    <div class="flex min-w-0 items-center gap-3">
        <UProgress
            :model-value="filled"
            size="sm"
            class="min-w-16 flex-1"
            :class="colorClass"
            :ui="{ base: 'bg-accented', indicator: 'bg-current' }"
            :aria-label="`${percent}% done`"
        />
        <span data-figure class="shrink-0 text-highlighted" :class="figureClass">
            {{ percent }}<span class="text-sm text-muted">%</span>
        </span>
    </div>
</template>

<script setup lang="ts">
interface Props {
    percent: number;
    size?: "md" | "lg";
}

const { percent, size = "md" } = defineProps<Props>();

const filled = computed(() => Math.min(percent, 100));
const colorClass = computed(() => toneClass(progressTone(percent)) || "text-dimmed");
const figureClass = computed(() => (size === "lg" ? "text-2xl" : "text-lg"));
</script>
