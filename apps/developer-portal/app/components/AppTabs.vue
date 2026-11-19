<template>
    <nav
        v-if="tabs.length > 0"
        data-scroll-x
        class="flex h-10 items-stretch gap-1 overflow-x-auto"
        :aria-label="`${label} sections`"
    >
        <NuxtLink
            v-for="tab in tabs"
            :key="tab.key"
            :to="tab.to"
            :aria-current="tab.active ? 'page' : undefined"
            class="flex shrink-0 items-center border-b-2 px-2 text-sm"
            :class="
                tab.active
                    ? 'border-primary font-medium text-highlighted'
                    : 'border-transparent text-muted hover:text-highlighted'
            "
        >
            {{ tab.label }}
        </NuxtLink>
    </nav>
</template>

<script setup lang="ts">
import { appEntries, locate, type NavLink } from "~/utils/apps";

const { nav }: { nav: Record<string, NavLink | undefined> } = useAppConfig();
const route = useRoute();

const found = computed(() => locate(appEntries(nav), route.path));

const label = computed(() => found.value?.app.label ?? "");

/** The sibling pages of an app that shows them as tabs, the current one marked. */
const tabs = computed(() =>
    found.value?.app.tabs
        ? found.value.app.entries.map((entry) => ({
              ...entry,
              active: entry.key === found.value?.entry.key,
          }))
        : [],
);
</script>
