<template>
    <UCard variant="flush">
        <template #header>
            <div class="flex items-center justify-between gap-4">
                <div>
                    <h2 class="font-semibold">{{ title }}</h2>
                    <p class="text-xs text-muted">{{ note }}</p>
                </div>
                <span class="shrink-0 text-xs text-dimmed tabular-nums">
                    {{ $t("listCard.shown", { shown, total }) }}
                </span>
            </div>
        </template>

        <slot v-if="shown === 0" name="empty">
            <EmptyState>{{ $t("listCard.empty") }}</EmptyState>
        </slot>
        <div v-else class="divide-y divide-default"><slot /></div>
    </UCard>
</template>

<script setup lang="ts">
interface Props {
    title: string;
    note: string;
    /** How many rows the filter lets through. */
    shown: number;
    total: number;
}

const { title, note, shown, total } = defineProps<Props>();
</script>
