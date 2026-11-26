<template>
    <ul class="flex flex-col">
        <li v-for="item in items" :key="item.id" class="border-t border-default">
            <ULink
                :to="portalUrl(`/decisions/${item.id}`)"
                class="group grid gap-2 py-6 md:grid-cols-2 md:gap-6"
            >
                <span class="text-heading text-highlighted group-hover:text-primary">
                    {{ item.question }}
                </span>
                <span class="text-base">{{ item.answer }}</span>
            </ULink>
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { DecisionQuestion } from "~/types/DecisionQuestion";

interface Props {
    items: readonly DecisionQuestion[];
}

const { items } = defineProps<Props>();
</script>
