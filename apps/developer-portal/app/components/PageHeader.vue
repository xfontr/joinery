<template>
    <header class="shrink-0 border-b border-default bg-default pb-5 has-data-tabs:pb-0">
        <div class="flex h-12 items-center gap-2 px-4 surface-ink lg:hidden">
            <NuxtLink to="/" class="font-display text-xl text-highlighted italic">
                {{ $t("pageHeader.wordmark") }}
            </NuxtLink>
            <span v-if="appLabel" class="truncate font-mono text-xs text-muted">
                / {{ appLabel }}
            </span>
            <UDashboardSearchButton
                :collapsed="true"
                color="neutral"
                variant="ghost"
                class="ml-auto text-muted"
            />
            <UDashboardSidebarToggle color="neutral" variant="ghost" class="text-muted" />
        </div>

        <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 px-4 pt-5 sm:px-6">
            <div class="min-w-0">
                <nav
                    v-if="trail.length > 1"
                    class="mb-1 flex items-center gap-1.5 font-mono text-xs text-muted"
                    :aria-label="$t('pageHeader.breadcrumb')"
                >
                    <template v-for="(crumb, index) in trail" :key="crumb.label">
                        <span v-if="index > 0" aria-hidden="true">/</span>
                        <NuxtLink v-if="crumb.to" :to="crumb.to" class="hover:text-highlighted">
                            {{ crumb.label }}
                        </NuxtLink>
                        <span v-else class="truncate">{{ crumb.label }}</span>
                    </template>
                </nav>
                <slot name="title">
                    <h1 class="truncate text-2xl font-semibold text-highlighted">{{ title }}</h1>
                </slot>
                <slot name="lead">
                    <p v-if="lead" class="mt-1 text-xs text-muted">{{ lead }}</p>
                </slot>
            </div>
            <div
                v-if="$slots.actions || $slots.facts"
                class="flex shrink-0 flex-col items-end gap-3 pb-1"
            >
                <div v-if="$slots.actions" class="flex items-center gap-2">
                    <slot name="actions" />
                </div>
                <slot name="facts" />
            </div>
        </div>

        <slot name="intro" />

        <AppTabs :tabs :title />
    </header>
</template>

<script setup lang="ts">
import type { Crumb } from "~/types/Crumb";
import type { PageTab } from "~/types/PageTab";
import { appEntries, locate } from "~/utils/apps";
import type { NavLink } from "~/types/NavLink";

interface Props {
    title: string;
    /** Where the page's figures come from, under the title. */
    lead?: string;
    /** The steps below the app, the page's own last. */
    crumbs?: Crumb[];
    tabs?: PageTab[];
}

const { title, lead = "", crumbs = [], tabs } = defineProps<Props>();

const { nav }: { nav: Record<string, NavLink | undefined> } = useAppConfig();
const route = useRoute();
const { t } = useI18n();

const here = computed(() => locate(appEntries(nav, t), route.path));

const appLabel = computed(() => here.value?.app.label.toLowerCase() ?? "");

const trail = computed((): Crumb[] => {
    const app = here.value?.app;

    return [
        { label: t("pageHeader.wordmark"), to: "/" },
        ...(app && app.id !== "home" ? [{ label: appLabel.value, to: app.entries[0]?.to }] : []),
        ...crumbs,
    ];
});
</script>
