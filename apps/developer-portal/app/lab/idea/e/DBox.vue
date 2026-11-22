<template>
    <section class="flex h-full min-w-0 flex-col border border-default bg-default">
        <header class="flex items-start justify-between gap-3 border-b border-default px-4 pt-3">
            <div class="min-w-0 pb-3">
                <h2 class="text-sm font-semibold text-highlighted">
                    <NuxtLink v-if="to" :to class="group inline-flex items-center gap-1">
                        {{ title }}
                        <UIcon
                            name="i-lucide-arrow-up-right"
                            class="size-3.5 text-dimmed group-hover:text-highlighted"
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
                :class="countClass"
            >
                {{ count }}
            </span>
        </header>

        <div
            v-if="filters.length > 0"
            data-scroll-x
            class="flex h-9 shrink-0 items-stretch gap-3 overflow-x-auto border-b border-default px-4"
            role="tablist"
            :aria-label="`${title} filter`"
        >
            <button
                v-for="item in filters"
                :key="item.id"
                type="button"
                role="tab"
                :aria-selected="item.id === filter"
                class="flex shrink-0 items-center gap-1.5 border-b-2 text-xs"
                :class="
                    item.id === filter
                        ? 'border-inverted font-medium text-highlighted'
                        : 'border-transparent text-muted hover:text-highlighted'
                "
                @click="filter = item.id"
            >
                {{ item.label }}
                <span v-if="item.count !== undefined" class="font-mono">{{ item.count }}</span>
            </button>
        </div>

        <div class="min-h-0 flex-1">
            <slot />
        </div>

        <NuxtLink
            v-if="all"
            :to="all.to"
            class="flex items-center justify-between gap-3 border-t border-default px-4 py-2 text-xs text-muted hover:bg-elevated hover:text-highlighted"
        >
            {{ all.label }}
            <UIcon name="i-lucide-arrow-right" class="size-3.5" />
        </NuxtLink>
    </section>
</template>

<script setup lang="ts">
interface BoxFilter {
    id: string;
    label: string;
    count?: number;
}

interface Props {
    title: string;
    meta?: string;
    to?: string;
    count?: number | string;
    countClass?: string;
    filters?: BoxFilter[];
    all?: { label: string; to: string } | null;
}

const {
    title,
    meta = "",
    to = "",
    count,
    countClass = "",
    filters = [],
    all = null,
} = defineProps<Props>();

const filter = defineModel<string>("filter", { default: "" });
</script>
