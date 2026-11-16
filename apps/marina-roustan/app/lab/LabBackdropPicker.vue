<template>
    <nav
        aria-label="Fondo"
        class="fixed bottom-24 left-3 z-20 flex flex-wrap gap-1 rounded-2xl border border-default bg-elevated p-2 text-sm shadow-lg md:bottom-4"
    >
        <span class="px-2 py-1 text-muted">Fondo</span>
        <NuxtLink
            v-for="item in backdropVariants"
            :key="item"
            :to="{ query: { ...route.query, fondo: item } }"
            replace
            class="rounded-full px-3 py-1"
            :class="item === current ? 'bg-inverted text-inverted' : 'hover:bg-muted'"
        >
            {{ item }}
        </NuxtLink>
    </nav>
</template>

<script setup lang="ts">
import { backdropVariants, useBackdropVariant } from "./backdrop";

const route = useRoute();
const current = useBackdropVariant();
</script>
