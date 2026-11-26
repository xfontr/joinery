<template>
    <UCard
        variant="flush"
        class="flex flex-col"
        :ui="{ header: 'p-0 sm:px-0', body: 'min-h-0 flex-1', footer: 'px-4 py-2 sm:px-4' }"
    >
        <template #header>
            <div class="flex items-start justify-between gap-3 px-4 py-3">
                <div class="min-w-0">
                    <h2 class="text-sm font-semibold text-highlighted">
                        <NuxtLink v-if="to" :to class="group inline-flex items-center gap-1">
                            {{ title }}
                            <UIcon
                                name="i-lucide-arrow-up-right"
                                class="size-3.5 text-muted group-hover:text-highlighted"
                            />
                        </NuxtLink>
                        <template v-else>{{ title }}</template>
                    </h2>
                    <p v-if="meta" class="truncate text-xs text-muted">{{ meta }}</p>
                </div>
                <span
                    v-if="count !== undefined"
                    data-figure
                    class="shrink-0 text-2xl leading-none text-highlighted"
                >
                    {{ count }}
                </span>
            </div>
            <UTabs
                v-if="filters.length > 0"
                v-model="filter"
                :items="filters"
                :content="false"
                variant="link"
                size="xs"
                color="neutral"
                data-scroll-x
                class="overflow-x-auto border-t border-default px-4"
                :ui="{
                    root: 'items-start',
                    list: 'mb-0 h-9 w-max gap-3 border-b-0 p-0',
                    indicator: 'bottom-0 h-0.5 rounded-none bg-inverted',
                    trigger:
                        'shrink-0 px-0 py-0 font-normal data-[state=active]:font-medium data-[state=active]:text-highlighted',
                    label: 'overflow-visible',
                    trailingBadge: 'bg-transparent px-0 font-mono text-xs text-muted ring-0',
                }"
            />
        </template>

        <slot />

        <template v-if="all" #footer>
            <NuxtLink
                :to="all.to"
                class="flex items-center justify-between gap-3 text-xs text-muted hover:text-highlighted"
            >
                {{ all.label }}
                <UIcon name="i-lucide-arrow-right" class="size-3.5" />
            </NuxtLink>
        </template>
    </UCard>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

interface Props {
    title: string;
    meta?: string;
    /** The page the whole dataset lives on, so the panel is a short list one step from the table. */
    to?: string;
    count?: number | string;
    filters?: TabsItem[];
    all?: { label: string; to: string } | null;
}

const { title, meta = "", to = "", count, filters = [], all = null } = defineProps<Props>();

const filter = defineModel<string>("filter", { default: "" });
</script>
