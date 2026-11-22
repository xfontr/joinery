<template>
    <nav
        class="inline-flex shrink-0 items-center gap-0.5 rounded-md p-0.5 font-mono text-xs ring ring-default"
        aria-label="Switch view"
    >
        <NuxtLink
            v-for="view in VIEWS"
            :key="view.id"
            :to="view.to"
            :aria-current="view.id === current ? 'true' : undefined"
            class="rounded-sm px-2 py-0.5"
            :class="
                view.id === current
                    ? 'bg-elevated text-highlighted'
                    : 'text-muted hover:text-highlighted'
            "
        >
            {{ view.label }}
        </NuxtLink>
    </nav>
</template>

<script setup lang="ts">
import type { View } from "~/types/View";

interface Props {
    current: View;
}

const { current } = defineProps<Props>();

const VIEWS: { id: View; label: string; to: string }[] = [
    { id: "visitor", label: "Visitor", to: "/" },
    { id: "dev", label: "Dev", to: "/overview" },
];
</script>
