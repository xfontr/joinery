<template>
    <nav
        data-view-switch
        class="inline-flex shrink-0 items-center gap-0.5 rounded-md p-0.5 font-mono text-xs ring ring-default"
        :aria-label="$t('viewSwitch.label')"
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
            {{ $t(`viewSwitch.${view.id}`) }}
        </NuxtLink>
    </nav>
</template>

<script setup lang="ts">
import type { View } from "~/types/View";

interface Props {
    current: View;
}

const { current } = defineProps<Props>();

const VIEWS: { id: View; to: string }[] = [
    { id: "visitor", to: "/" },
    { id: "dev", to: "/overview" },
];
</script>
