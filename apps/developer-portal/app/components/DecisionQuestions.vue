<template>
    <ul class="flex flex-col">
        <li v-for="item in items" :key="item.id">
            <ULink
                :to="`/decisions/${item.id}`"
                class="group grid gap-2 border-t border-default"
                :class="split ? 'py-6 md:grid-cols-12' : 'py-5'"
            >
                <span
                    class="font-display text-2xl text-highlighted group-hover:text-primary"
                    :class="split && 'md:col-span-6'"
                >
                    {{ item.question }}
                </span>
                <span class="max-w-xl text-base text-muted" :class="split && 'md:col-span-6'">
                    {{ item.answer }}
                </span>
            </ULink>
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { DecisionQuestion } from "~/types/DecisionQuestion";

interface Props {
    items: readonly DecisionQuestion[];
    /** Question and answer side by side from `md` up, for a full-width list. */
    split?: boolean;
}

const { items, split = false } = defineProps<Props>();
</script>
