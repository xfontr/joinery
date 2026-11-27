<template>
    <dl v-if="facts.length > 0" class="flex flex-wrap gap-x-8 gap-y-4 sm:justify-end">
        <div v-for="fact in facts" :key="fact.label" class="flex flex-col gap-1">
            <dt class="text-xs text-muted first-letter:uppercase">
                <button
                    v-if="fact.series"
                    type="button"
                    class="border-b border-dashed border-current hover:text-highlighted"
                    :class="fact.series === series && 'border-solid text-highlighted'"
                    :aria-pressed="fact.series === series"
                    @click="series = fact.series"
                >
                    {{ fact.label }}
                </button>
                <template v-else>{{ fact.label }}</template>
            </dt>
            <dd data-figure class="text-3xl leading-none text-highlighted" :class="fact.class">
                {{ fact.value }}
            </dd>
        </div>
    </dl>
</template>

<script setup lang="ts">
import type { PageFact } from "~/types/PageFact";

interface Props {
    facts: PageFact[];
}

const { facts } = defineProps<Props>();

const series = defineModel<string>("series", { default: "" });
</script>
