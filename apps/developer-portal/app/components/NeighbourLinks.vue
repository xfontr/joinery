<template>
    <div class="grid gap-3 sm:grid-cols-2">
        <NuxtLink
            v-if="previous"
            :to="previous.to"
            class="flex items-center gap-2 rounded-lg border border-default p-3 transition-colors hover:bg-elevated/50"
        >
            <UIcon name="i-lucide-arrow-left" class="size-4 text-dimmed" />
            <div class="min-w-0">
                <div class="text-xs text-dimmed">{{ before }}</div>
                <div class="truncate text-sm">{{ previous.title }}</div>
            </div>
        </NuxtLink>

        <NuxtLink
            v-if="next"
            :to="next.to"
            class="flex items-center justify-end gap-2 rounded-lg border border-default p-3 transition-colors hover:bg-elevated/50 sm:col-start-2"
        >
            <div class="min-w-0 text-right">
                <div class="text-xs text-dimmed">{{ after }}</div>
                <div class="truncate text-sm">{{ next.title }}</div>
            </div>
            <UIcon name="i-lucide-arrow-right" class="size-4 text-dimmed" />
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import type { Neighbour } from "~/types/Neighbour";

interface Props {
    previous: Neighbour | null;
    next: Neighbour | null;
    /** The label over the previous link, such as "Previous". */
    before: string;
    after: string;
}

const { previous, next, before, after } = defineProps<Props>();
</script>
