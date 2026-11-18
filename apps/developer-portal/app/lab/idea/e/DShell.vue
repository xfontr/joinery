<template>
    <div class="min-h-screen bg-muted text-default">
        <aside
            data-chrome
            class="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-(--chrome-line) lg:flex"
            :class="railCollapsed ? 'w-14' : 'w-60'"
            aria-label="Developer view"
        >
            <DRail
                :app
                :sections
                :collapsed="railCollapsed"
                collapsible
                @search="searchOpen = true"
                @toggle="railCollapsed = !railCollapsed"
            />
        </aside>

        <header data-chrome class="sticky top-0 z-20 flex h-12 items-center gap-3 px-4 lg:hidden">
            <NuxtLink :to="BASE" class="flex items-center gap-2 text-sm font-semibold">
                <span class="font-serif text-xl font-normal italic">monorepo</span>
            </NuxtLink>
            <span class="truncate font-mono text-xs text-(--chrome-muted)">/ {{ appLabel }}</span>
            <button
                type="button"
                class="ml-auto grid size-8 place-items-center text-(--chrome-muted) hover:text-(--chrome-text)"
                aria-label="Search"
                @click="searchOpen = true"
            >
                <UIcon name="i-lucide-search" class="size-4" />
            </button>
            <button
                type="button"
                class="grid size-8 place-items-center text-(--chrome-muted) hover:text-(--chrome-text)"
                aria-label="Open navigation"
                @click="drawerOpen = true"
            >
                <UIcon name="i-lucide-menu" class="size-4" />
            </button>
        </header>

        <USlideover v-model:open="drawerOpen" side="left" :ui="{ content: 'max-w-72' }">
            <template #content>
                <div data-chrome class="flex h-full flex-col">
                    <DRail
                        :app
                        :sections
                        @search="openSearchFromDrawer"
                        @navigate="drawerOpen = false"
                    />
                </div>
            </template>
        </USlideover>

        <div :class="railCollapsed ? 'lg:pl-14' : 'lg:pl-60'">
            <header class="border-b border-default bg-default">
                <div
                    class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 px-4 pt-5 md:px-6"
                >
                    <div class="min-w-0">
                        <nav
                            class="mb-1 flex items-center gap-1.5 font-mono text-xs text-muted"
                            aria-label="Breadcrumb"
                        >
                            <template
                                v-for="(crumb, index) in trail.length > 1 ? trail : []"
                                :key="crumb.label"
                            >
                                <span v-if="index > 0" aria-hidden="true">/</span>
                                <NuxtLink
                                    v-if="crumb.to"
                                    :to="crumb.to"
                                    class="hover:text-highlighted"
                                >
                                    {{ crumb.label }}
                                </NuxtLink>
                                <span v-else class="truncate">{{ crumb.label }}</span>
                            </template>
                        </nav>
                        <slot name="title">
                            <h1 class="truncate text-2xl font-semibold text-highlighted">
                                {{ page }}
                            </h1>
                        </slot>
                    </div>
                    <div class="flex shrink-0 items-center gap-2 pb-1">
                        <slot name="actions" />
                    </div>
                </div>
                <slot name="intro" />
                <nav
                    v-if="tabs.length > 0"
                    data-scroll-x
                    class="mt-3 flex h-10 items-stretch gap-1 overflow-x-auto px-2 md:px-4"
                    :aria-label="`${page} sections`"
                >
                    <NuxtLink
                        v-for="tab in tabs"
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
                <div v-else class="h-5" />
            </header>

            <main class="px-4 pt-6 pb-16 md:px-6">
                <slot />
            </main>
        </div>

        <DStatusBar />

        <UModal v-model:open="searchOpen" :ui="{ content: 'max-w-xl' }">
            <template #content>
                <UCommandPalette
                    :groups="searchGroups"
                    :loading="status === 'pending'"
                    placeholder="Search projects, apps and docs…"
                    class="h-96"
                    @update:model-value="go"
                />
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type { CommandPaletteItem } from "@nuxt/ui";
import { apps, BASE, projectPath, type AppId } from "./apps";
import DRail, { type RailItem } from "./DRail.vue";
import DStatusBar from "./DStatusBar.vue";

export interface DTab {
    label: string;
    to: string;
    active: boolean;
    count?: number | string;
}

interface Props {
    app: AppId;
    page: string;
    crumbs?: { label: string; to?: string }[];
    sections?: RailItem[];
    tabs?: DTab[];
}

const { app, page, crumbs = [], sections = [], tabs = [] } = defineProps<Props>();

useHead({
    title: () => `${page} · Developer view E · Lab`,
    bodyAttrs: { "data-lab": "idea-dev-e" },
    link: [
        {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,300&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+Condensed:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
        },
    ],
});

const appLabel = computed(() => apps.find((item) => item.id === app)?.label.toLowerCase() ?? "");
const appEntry = computed(() => apps.find((item) => item.id === app));

const trail = computed(() => [
    { label: "monorepo", to: BASE },
    ...(app === "home" ? [] : [{ label: appLabel.value, to: appEntry.value?.to ?? undefined }]),
    ...crumbs,
]);

const drawerOpen = ref(false);
const railCollapsed = useCookie<boolean>("lab-e-rail-collapsed", { default: () => false });
const searchOpen = ref(false);

const openSearchFromDrawer = (): void => {
    drawerOpen.value = false;
    searchOpen.value = true;
};

defineShortcuts({ meta_k: () => (searchOpen.value = !searchOpen.value) });

const { data: projects } = await useSnapshot("projects");

const {
    data: docSections,
    status,
    execute,
} = useAsyncData("lab-e-search-sections", () => queryCollectionSearchSections("docs"), {
    default: () => [],
    immediate: false,
    server: false,
});

watch(searchOpen, () => {
    if (searchOpen.value && status.value === "idle") execute();
});

const searchGroups = computed(() => [
    {
        id: "apps",
        label: "Apps",
        items: apps.flatMap((item) =>
            item.to ? [{ label: item.label, to: item.to, icon: "i-lucide-app-window" }] : [],
        ),
    },
    {
        id: "projects",
        label: "Projects",
        items: (projects.value?.projects?.projects ?? []).map((project) => ({
            label: project.name,
            suffix: project.root,
            to: projectPath(project.root),
            icon: "i-lucide-box",
        })),
    },
    {
        id: "docs",
        label: "Docs",
        items: docSections.value.map((section) => ({
            label: section.title,
            suffix: section.content,
            to: `/wiki${section.id}`,
            icon: "i-lucide-file-text",
        })),
    },
]);

const go = (item: CommandPaletteItem | undefined): void => {
    if (!item?.to) return;
    searchOpen.value = false;
    void navigateTo(String(item.to));
};
</script>

<style src="./developer.css"></style>
