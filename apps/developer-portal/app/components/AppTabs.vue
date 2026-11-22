<template>
    <nav
        v-if="shown.length > 0"
        data-scroll-x
        data-tabs
        class="mt-3 flex h-10 items-stretch gap-1 overflow-x-auto px-2 sm:px-4"
        :aria-label="$t('appTabs.label', { app: label })"
    >
        <NuxtLink
            v-for="tab in shown"
            :key="tab.to"
            :to="tab.to"
            :aria-current="tab.active ? 'page' : undefined"
            class="flex shrink-0 items-center gap-1.5 border-b-2 px-2 text-sm"
            :class="
                tab.active
                    ? 'border-inverted font-medium text-highlighted'
                    : 'border-transparent text-muted hover:text-highlighted'
            "
        >
            {{ tab.label }}
            <span v-if="tab.count !== undefined" class="font-mono text-xs text-muted">
                {{ tab.count }}
            </span>
        </NuxtLink>
    </nav>
</template>

<script setup lang="ts">
import type { PageTab } from "~/types/PageTab";
import { appEntries, locate } from "~/utils/apps";
import type { NavLink } from "~/types/NavLink";

interface Props {
    /** A page's own sections; without them the tabs are the app's sibling pages. */
    tabs?: PageTab[];
    title?: string;
}

const { tabs, title } = defineProps<Props>();

const { nav }: { nav: Record<string, NavLink | undefined> } = useAppConfig();
const route = useRoute();
const { t } = useI18n();

const found = computed(() => locate(appEntries(nav, t), route.path));

const label = computed(() => title ?? found.value?.app.label ?? "");

const shown = computed((): PageTab[] => {
    if (tabs) return tabs;

    return found.value?.app.tabs
        ? found.value.app.entries.map((entry) => ({
              label: entry.label,
              to: entry.to,
              active: entry.key === found.value?.entry.key,
          }))
        : [];
});
</script>
