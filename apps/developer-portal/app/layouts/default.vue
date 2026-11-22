<template>
    <UDashboardGroup unit="rem">
        <a
            href="#content"
            class="sr-only z-50 bg-primary text-sm font-semibold text-inverted focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:px-4 focus:py-3"
            >{{ $t("app.skipLink") }}</a
        >

        <UDashboardSidebar
            id="dashboard"
            resizable
            collapsible
            :default-size="15"
            :min-size="12"
            :max-size="20"
            :collapsed-size="3.5"
            :ui="{
                root: 'surface-ink min-h-0 border-e border-default',
                content: 'surface-ink lg:hidden',
                header: 'h-14 pr-2 pl-5',
                body: 'gap-4 px-3 py-0 pb-4',
                footer: 'border-t border-default px-3',
            }"
        >
            <template #header="{ collapsed }">
                <NuxtLink
                    v-if="!collapsed"
                    to="/"
                    class="min-w-0 flex-1 font-display text-xl text-highlighted italic"
                    :aria-label="$t('app.dev.visitorLabel')"
                >
                    {{ $t("app.dev.wordmark") }}
                </NuxtLink>
                <UDashboardSidebarCollapse
                    color="neutral"
                    class="text-muted"
                    :class="collapsed && 'mx-auto'"
                />
            </template>

            <template #default="{ collapsed }">
                <UButton
                    v-if="collapsed"
                    to="/"
                    icon="i-lucide-arrow-left-right"
                    color="neutral"
                    variant="ghost"
                    class="mx-auto text-muted"
                    :aria-label="$t('app.dev.visitorSwitch')"
                    :title="$t('app.dev.visitorSwitchTitle')"
                />
                <ViewSwitch v-else current="dev" class="self-start" />

                <UDashboardSearchButton
                    :collapsed
                    color="neutral"
                    variant="outline"
                    size="sm"
                    class="bg-elevated text-sm font-normal text-muted ring-default"
                    :ui="{ leadingIcon: 'size-3.5' }"
                />

                <!-- It hands every nested list's open state to one v-model, so it stays uncontrolled -->
                <UNavigationMenu
                    :key="route.path"
                    :items="rail"
                    :collapsed
                    orientation="vertical"
                    color="neutral"
                    variant="link"
                    highlight
                    highlight-color="primary"
                    trailing-trigger
                    popover
                    :ui="{
                        link: 'h-9 gap-2.5 px-2 py-0 font-normal text-muted hover:text-highlighted data-active:font-medium data-active:text-highlighted',
                        linkLeadingIcon: 'size-4',
                        linkTrailingIcon: 'size-3.5',
                        childLink: 'h-8 items-center gap-2 py-0 text-sm',
                        childLinkIcon: 'size-3.5',
                        linkTrailingBadge:
                            'bg-transparent px-0 font-mono text-xs text-muted ring-0',
                    }"
                    :aria-label="$t('app.dev.navLabel')"
                />
            </template>

            <template #footer="{ collapsed }">
                <div class="flex w-full items-center gap-1" :class="collapsed && 'flex-col'">
                    <UColorModeButton
                        :label="collapsed ? undefined : $t('app.dev.colorMode')"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                        class="text-muted"
                        :ui="{ leadingIcon: 'size-3.5' }"
                    />

                    <UButton
                        :to="repoUrl"
                        target="_blank"
                        icon="i-simple-icons-github"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                        :label="collapsed ? undefined : $t('app.dev.source')"
                        :ui="{ leadingIcon: 'size-3.5' }"
                        class="text-muted"
                        :class="!collapsed && 'ml-auto'"
                        :aria-label="$t('app.dev.sourceLabel')"
                    />
                </div>
            </template>
        </UDashboardSidebar>

        <UDashboardSearch
            v-model:open="search.open.value"
            :groups="search.groups.value"
            :loading="search.loading.value"
            :placeholder="$t('app.dev.search')"
        />

        <!-- The status bar spans this column, so it starts where the rail ends at any width -->
        <div class="relative flex min-w-0 flex-1 flex-col">
            <main id="content" tabindex="-1" class="flex min-h-0 flex-1 flex-col outline-none">
                <slot />
            </main>
            <StatusBar :collected :items="statusItems" />
        </div>
    </UDashboardGroup>
</template>

<script setup lang="ts">
import "#layers/design/app/assets/main.css";

const route = useRoute();
const {
    public: { repoUrl },
} = useRuntimeConfig();

const { figures, collected, ready } = useShellFigures();
const { apps, menus, items: rail } = useRailEntries(figures);
const statusItems = useStatusItems(figures);
const search = useShellSearch(apps, menus.projects);

await ready;
</script>
