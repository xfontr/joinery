<template>
    <div class="flex min-w-48 flex-1 flex-col gap-1">
        <span class="flex items-baseline justify-between gap-x-4 text-xs text-dimmed">
            <span class="font-semibold text-muted">{{ $t("workflowReplay.title") }}</span>
            <output class="tabular-nums">{{ label }}</output>
        </span>
        <span class="flex h-6 items-center gap-2">
            <USlider
                v-model="day"
                :min="0"
                :max="lastDay"
                size="xs"
                class="flex-1"
                :aria-label="$t('workflowReplay.label')"
            />
            <UButton
                :label="$t('workflowReplay.today')"
                color="neutral"
                variant="ghost"
                size="xs"
                :disabled="day >= lastDay"
                @click="day = lastDay"
            />
        </span>
    </div>
</template>

<script setup lang="ts">
interface Props {
    /** How many days the snapshot covers. */
    days: number;
    label: string;
}

const { days, label } = defineProps<Props>();
const day = defineModel<number>("day", { required: true });

const lastDay = computed(() => days - 1);
</script>
