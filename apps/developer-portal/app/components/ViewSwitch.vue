<template>
    <nav
        data-view-switch
        class="inline-flex shrink-0 items-center gap-0.5 rounded-md p-0.5 font-mono text-xs ring ring-default"
        :aria-label="$t('viewSwitch.label')"
    >
        <NuxtLink
            v-for="view in VIEWS"
            :key="view.id"
            v-slot="{ href, navigate }"
            :to="view.to"
            custom
        >
            <a
                :href="href ?? undefined"
                :aria-current="view.id === current ? 'true' : undefined"
                class="rounded-sm px-2 py-0.5"
                :class="
                    view.id === current
                        ? 'bg-elevated text-highlighted'
                        : 'text-muted hover:text-highlighted'
                "
                @click="go($event, navigate)"
            >
                {{ $t(`viewSwitch.${view.id}`) }}
            </a>
        </NuxtLink>
    </nav>
</template>

<script setup lang="ts">
import { usePreferredReducedMotion } from "@vueuse/core";
import type { View } from "~/types/View";

interface Props {
    current: View;
}

const { current } = defineProps<Props>();

const VIEWS: { id: View; to: string }[] = [
    { id: "visitor", to: "/" },
    { id: "dev", to: "/overview" },
];

/** How long the old view may stay frozen if the new one never reports in. */
const SETTLE_MS = 1000;

const nuxtApp = useNuxtApp();
const reducedMotion = usePreferredReducedMotion();

/** Resolves once the new layout has painted, so the transition captures it rather than the old one. */
const swap = (navigate: () => Promise<unknown>) =>
    new Promise<void>((resolve) => {
        const off = nuxtApp.hooks.hookOnce("page:finish", () => resolve());
        setTimeout(() => {
            off();
            resolve();
        }, SETTLE_MS);
        void navigate();
    });

const go = (event: MouseEvent, navigate: () => Promise<unknown>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
        return;
    event.preventDefault();

    if (!document.startViewTransition || reducedMotion.value === "reduce") void navigate();
    else document.startViewTransition(() => swap(navigate));
};
</script>
