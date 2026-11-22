<template>
    <UCard variant="flush">
        <template #header>
            <h2 class="font-semibold">Recently changed</h2>
            <p class="mt-1 text-xs text-muted">
                From the last commit that touched each file, not from a page view.
            </p>
        </template>

        <EmptyState v-if="recent.length === 0">
            Nothing collected yet — run
            <code class="font-mono">pnpm exec nx collect @monorepo/developer-portal</code>.
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

const recent = computed(() =>
    pages
        .filter((page) => page.updatedAt !== null && known.has(toCollectionPath(page.path)))
        .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
        .slice(0, 8)
        .map((page) => ({
            path: page.path,
            to: `/wiki${toCollectionPath(page.path)}`,
            icon: kindIcon(page.kind),
            updated: relativeTime(page.updatedAt),
        })),
);
</script>
