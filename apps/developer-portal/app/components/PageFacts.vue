<template>
    <div class="mt-2 px-4 sm:px-6">
        <p class="text-xs text-muted">{{ provenance }}</p>
        <dl v-if="facts.length > 0" class="mt-4 flex flex-wrap gap-x-8 gap-y-4">
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
    </div>
</template>

<script setup lang="ts">
export interface PageFact {
    label: string;
    value: string;
    class?: string;
    /** Set on a figure that also picks what the page's chart draws. */
    series?: string;
}

interface Props {
    provenance: string;
    facts: PageFact[];
}

const { provenance, facts } = defineProps<Props>();

const series = defineModel<string>("series", { default: "" });
</script>
