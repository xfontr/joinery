<template>
    <WidgetPanel
        :title="tab.label"
        :meta="`Running in ${name}`"
        :count="tab.items.length"
        :to="tab.to"
    >
        <EmptyState v-if="tab.items.length === 0">{{ tab.empty }}</EmptyState>
        <ul v-else class="divide-y divide-default">
            <li v-for="row in rows" :key="row.id">
                <NuxtLink :to="row.to" class="flex flex-col gap-2 px-4 py-3 hover:bg-elevated">
                    <div class="flex items-baseline justify-between gap-3">
                        <span class="truncate text-sm font-medium text-highlighted">
                            {{ row.title }}
                        </span>
                        <span data-figure class="text-xl leading-none text-highlighted">
                            {{ row.percent }}<span class="text-sm text-muted">%</span>
                        </span>
                    </div>
                    <SplitBar :parts="row.parts" />
                </NuxtLink>
            </li>
        </ul>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { ProjectTab } from "~/types/ProjectTab";
import type { ProjectTabRow } from "~/types/ProjectTabRow";
import type { SplitPart } from "~/types/SplitPart";

interface Props {
    tab: ProjectTab & { items: ProjectTabRow[] };
    /** The project's folder. */
    name: string;
}

const { tab, name } = defineProps<Props>();

const rows = computed(() =>
    tab.items.map((row) => ({
        ...row,
        parts: [
            { label: "done", value: row.done, tone: "ink" },
            { label: "to go", value: row.left, tone: "soft" },
        ] satisfies SplitPart[],
    })),
);
</script>
