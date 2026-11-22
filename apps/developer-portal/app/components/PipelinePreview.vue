<template>
    <ol class="flex flex-wrap gap-1.5">
        <li
            v-for="(step, index) in PIPELINE"
            :key="step"
            data-pipeline-step
            class="border border-default px-2 py-1 font-mono text-xs text-muted"
            :style="{ '--step': index }"
        >
            {{ $t(`method.agents.pipeline.${step}.step`) }}
        </li>
    </ol>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
    [data-pipeline-step] {
        animation: lit 3s calc(var(--step) * 0.5s) infinite;
    }
}

@keyframes lit {
    0%,
    16% {
        border-color: var(--ui-primary);
        color: var(--ui-primary);
    }

    17%,
    100% {
        border-color: var(--ui-border);
        color: var(--ui-text-muted);
    }
}
</style>
