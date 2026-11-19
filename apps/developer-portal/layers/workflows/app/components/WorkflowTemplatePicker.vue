<template>
    <fieldset class="flex flex-col gap-3">
        <legend class="sr-only">Template</legend>
        <label
            v-for="card in cards"
            :key="card.id"
            class="flex cursor-pointer flex-col gap-3 rounded-xl border p-5 text-left transition-colors hover:bg-elevated/50 has-focus-visible:ring-2 has-focus-visible:ring-primary"
            :class="
                card.id === modelValue ? 'border-primary bg-primary/5' : 'border-default bg-default'
            "
        >
            <input
                type="radio"
                class="sr-only"
                :name
                :value="card.id"
                :checked="card.id === modelValue"
                @change="emit('update:modelValue', card.id)"
            />
            <span class="flex items-start justify-between gap-3">
                <span>
                    <span class="block text-base font-semibold">{{ card.title }}</span>
                    <span class="block text-sm text-muted">{{ card.summary }}</span>
                </span>
                <UIcon
                    :name="card.id === modelValue ? 'i-lucide-circle-check' : 'i-lucide-circle'"
                    class="size-5 shrink-0"
                    :class="card.id === modelValue ? 'text-primary' : 'text-dimmed'"
                />
            </span>
            <span class="flex flex-wrap gap-1.5">
                <span
                    v-for="stage in card.stages"
                    :key="stage.title"
                    class="rounded-sm border border-(--stage)/40 bg-(--stage)/12 px-2 py-0.5 text-xs"
                    :style="{ '--stage': stage.color }"
                >
                    {{ stage.title }}
                </span>
            </span>
            <span class="text-xs text-dimmed tabular-nums">{{ card.counts }}</span>
        </label>
    </fieldset>
</template>

<script setup lang="ts">
import { templateEstimate, type Template } from "#layers/workflows/shared/workflows.ts";

interface Props {
    templates: Template[];
    modelValue: string;
}

const { templates, modelValue } = defineProps<Props>();
const emit = defineEmits<{ "update:modelValue": [template: string] }>();
const name = useId();

const cards = computed(() =>
    templates.map((template) => {
        const { blocks, tickets, points } = templateEstimate(template);
        return {
            id: template.id,
            title: template.title,
            summary: template.summary,
            stages: template.stages.map((stage, index) => ({
                title: stage.title,
                color: stageColor(index),
            })),
            counts: `${blocks} blocks by default · ${tickets.fast}–${tickets.block} tickets · ${points} SP`,
        };
    }),
);
</script>
