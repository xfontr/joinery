<template>
    <UCard variant="flush">
        <template #header>
            <h2 class="font-semibold">{{ $t("wikiRecent.title") }}</h2>
            <p class="mt-1 text-xs text-muted">{{ $t("wikiRecent.note") }}</p>
        </template>

        <EmptyState v-if="recent.length === 0">
            <I18nT keypath="wikiRecent.empty" scope="global">
                <template #command>
                    <code class="font-mono">{{ COLLECT }}</code>
                </template>
            </I18nT>
        </EmptyState>

        <div v-else class="divide-y divide-default">
            <NuxtLink
                v-for="page in recent"
                :key="page.path"
                :to="page.to"
                class="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-elevated/50"
            >
                <UIcon :name="page.icon" class="size-3.5 shrink-0 text-dimmed" />
                <span class="flex-1 truncate font-mono text-xs">{{ page.path }}</span>
                <span class="shrink-0 text-xs text-dimmed">{{ page.updated }}</span>
            </NuxtLink>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { toCollectionPath } from "#layers/docs/shared/docPages.ts";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";

interface Props {
    pages: DocPage[];
    /** Every path in the wiki tree, so a file the tree leaves out isn't listed. */
    known: Set<string>;
}

const { pages, known } = defineProps<Props>();

const COLLECT = "pnpm exec nx collect @joinery/developer-portal";

const recent = computed(() =>
    pages
        .filter((page) => page.updatedAt !== null && known.has(toCollectionPath(page.path)))
        .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
        .slice(0, 8)
        .map((page) => ({
            path: page.path,
            to: `/wiki${toCollectionPath(page.path)}`,
            icon: kindIcon(page.kind),
            updated: page.updatedAt ? calendarDay(page.updatedAt.slice(0, 10)) : "",
        })),
);
</script>
