<template>
    <component
        :is="ordered ? 'ol' : 'ul'"
        :class="grid ? 'grid gap-x-6 md:grid-cols-3' : 'flex flex-col'"
    >
        <li
            v-for="item in rows"
            :key="item.id"
            class="border-t border-default"
            :class="
                grid ? 'flex flex-col gap-2 pt-4 pb-6' : 'grid gap-2 py-5 md:grid-cols-3 md:gap-6'
            "
        >
            <span class="text-heading text-highlighted">{{ item.term }}</span>
            <span class="text-base" :class="!grid && 'md:col-span-2'">
                <template v-for="(part, index) in item.parts" :key="index">
                    <strong v-if="part.strong" class="font-medium text-highlighted">
                        <ULink
                            v-if="item.links?.[part.text]"
                            :to="item.links[part.text]"
                            raw
                            class="link"
                        >
                            {{ part.text }}
                        </ULink>
                        <template v-else>{{ part.text }}</template>
                    </strong>
                    <template v-else>{{ part.text }}</template>
                </template>
            </span>
        </li>
    </component>
</template>

<script setup lang="ts">
import type { Term } from "~/types/Term";

interface Props {
    items: readonly Term[];
    ordered?: boolean;
    /** Three terms a row from `md`, each over its detail, instead of one term a row beside it. */
    grid?: boolean;
}

const { items, ordered = false, grid = false } = defineProps<Props>();

const rows = computed(() => items.map((item) => ({ ...item, parts: emphasis(item.detail) })));
</script>
