<template>
    <div class="flex h-full flex-col">
        <div
            class="flex h-14 shrink-0 items-center gap-2"
            :class="collapsed ? 'justify-center' : 'pr-2 pl-5'"
        >
            <NuxtLink
                v-if="!collapsed"
                :to="BASE"
                class="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold"
                @click="emit('navigate')"
            >
                <span class="font-serif text-xl font-normal italic">monorepo</span>
                <span class="font-normal text-(--chrome-muted)">dev</span>
            </NuxtLink>
            <button
                v-if="collapsible"
                type="button"
                class="grid size-8 shrink-0 place-items-center text-(--chrome-muted) hover:text-(--chrome-text)"
                :aria-label="collapsed ? 'Expand navigation' : 'Collapse navigation'"
                :aria-expanded="!collapsed"
                @click="emit('toggle')"
            >
                <UIcon
                    :name="collapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
                    class="size-4"
                />
            </button>
        </div>

        <button
            type="button"
            class="mb-4 flex items-center gap-3 border border-(--chrome-line) bg-(--chrome-raised) text-sm text-(--chrome-muted) hover:text-(--chrome-text)"
            :class="collapsed ? 'mx-2 justify-center py-1.5' : 'mx-3 justify-between px-2.5 py-1.5'"
            :aria-label="collapsed ? 'Search' : undefined"
            :title="collapsed ? 'Search ⌘K' : undefined"
            @click="emit('search')"
        >
            <span class="flex items-center gap-2">
                <UIcon name="i-lucide-search" class="size-3.5" />
                <template v-if="!collapsed">Search</template>
            </span>
            <kbd v-if="!collapsed" class="text-xs">⌘K</kbd>
        </button>

        <nav class="min-h-0 flex-1 overflow-y-auto pb-4" aria-label="Apps">
            <ul>
                <li v-for="item in apps" :key="item.id">
                    <NuxtLink
                        v-if="item.to"
                        :to="item.to"
                        :aria-current="item.id === app ? 'page' : undefined"
                        :aria-label="collapsed ? item.label : undefined"
                        :title="collapsed ? item.label : undefined"
                        class="flex h-9 items-center gap-2.5 border-l-2 text-sm"
                        :class="[
                            collapsed ? 'justify-center' : 'px-5',
                            item.id === app
                                ? 'border-(--signal) font-medium text-(--chrome-text)'
                                : 'border-transparent text-(--chrome-muted) hover:text-(--chrome-text)',
                        ]"
                        @click="emit('navigate')"
                    >
                        <UIcon :name="item.icon" class="size-4 shrink-0" />
                        <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
                    </NuxtLink>
                    <span
                        v-else
                        class="flex h-9 cursor-not-allowed items-center gap-2.5 border-l-2 border-transparent text-sm text-(--chrome-muted) opacity-50"
                        :class="collapsed ? 'justify-center' : 'px-5'"
                        :aria-label="collapsed ? item.label : undefined"
                        :title="
                            collapsed ? `${item.label} · not in the lab yet` : 'Not in the lab yet'
                        "
                    >
                        <UIcon :name="item.icon" class="size-4 shrink-0" />
                        <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
                    </span>

                    <ul v-if="item.id === app && sections.length > 0 && !collapsed" class="mb-2">
                        <li v-for="section in sections" :key="section.label">
                            <NuxtLink
                                :to="section.to"
                                :aria-current="section.active ? 'page' : undefined"
                                class="flex h-8 items-center gap-2 pr-5 pl-9 text-sm"
                                :class="
                                    section.active
                                        ? 'bg-(--chrome-raised) text-(--chrome-text)'
                                        : 'text-(--chrome-muted) hover:text-(--chrome-text)'
                                "
                                @click="emit('navigate')"
                            >
                                <UIcon :name="section.icon" class="size-3.5 shrink-0" />
                                <span class="min-w-0 flex-1 truncate">{{ section.label }}</span>
                                <span
                                    v-if="section.value !== undefined"
                                    class="shrink-0 font-mono text-xs"
                                    :class="toneClass(section.tone ?? 'neutral')"
                                >
                                    {{ section.value }}
                                </span>
                            </NuxtLink>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>

        <div
            class="flex shrink-0 items-center gap-1 border-t border-(--chrome-line) py-2"
            :class="collapsed ? 'flex-col px-1' : 'px-3'"
        >
            <ClientOnly>
                <button
                    type="button"
                    class="flex h-8 items-center gap-2 px-2 text-xs text-(--chrome-muted) hover:text-(--chrome-text)"
                    :aria-label="collapsed ? themeLabel : undefined"
                    :title="collapsed ? themeLabel : undefined"
                    @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
                >
                    <UIcon
                        :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
                        class="size-3.5"
                    />
                    <template v-if="!collapsed">{{ themeLabel }}</template>
                </button>
            </ClientOnly>
            <a
                :href="repoUrl"
                target="_blank"
                class="flex h-8 items-center gap-2 px-2 text-xs text-(--chrome-muted) hover:text-(--chrome-text)"
                :class="collapsed ? '' : 'ml-auto'"
                :aria-label="collapsed ? 'Source' : undefined"
                :title="collapsed ? 'Source' : undefined"
            >
                <UIcon name="i-simple-icons-github" class="size-3.5" />
                <template v-if="!collapsed">Source</template>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Tone } from "~/types/Tone";
import { apps, BASE, type AppId } from "./apps";

export interface RailItem {
    label: string;
    icon: string;
    to: string;
    value?: string;
    tone?: Tone;
    active?: boolean;
}

interface Props {
    app: AppId;
    sections: RailItem[];
    collapsed?: boolean;
    collapsible?: boolean;
}

const { app, sections, collapsed = false, collapsible = false } = defineProps<Props>();

const emit = defineEmits<{ search: []; navigate: []; toggle: [] }>();

const colorMode = useColorMode();

const themeLabel = computed(() => (colorMode.value === "dark" ? "Light" : "Dark"));

const {
    public: { repoUrl },
} = useRuntimeConfig();
</script>
