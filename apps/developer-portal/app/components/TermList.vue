<template>
    <component :is="ordered ? 'ol' : 'ul'" class="flex flex-col">
        <li
            v-for="item in rows"
            :key="item.id"
            class="grid gap-1 border-t border-default py-4"
            :class="wide ? 'sm:grid-cols-4' : 'sm:grid-cols-3'"
        >
            <span class="font-display text-2xl text-highlighted">{{ item.term }}</span>
            <span class="text-base" :class="wide ? 'sm:col-span-3' : 'sm:col-span-2'">
                <template v-for="(part, index) in item.parts" :key="index">
                    <strong v-if="part.strong" class="font-semibold text-highlighted">
                        <ULink
                            v-if="item.links?.[part.text]"
                            :to="item.links[part.text]"
                            raw
                            class="text-highlighted underline decoration-primary underline-offset-4"
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
    /** Gives the detail three columns of four instead of two of three. */
    wide?: boolean;
}

const { items, ordered = false, wide = false } = defineProps<Props>();

const rows = computed(() => items.map((item) => ({ ...item, parts: emphasis(item.detail) })));
</script>
