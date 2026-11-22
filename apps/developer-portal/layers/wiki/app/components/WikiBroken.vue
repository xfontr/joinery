<template>
    <UAlert
        v-if="broken.length > 0"
        color="warning"
        variant="subtle"
        icon="i-lucide-link-2-off"
        title="Broken relative links"
    >
        <template #description>
            <div class="mt-1 flex flex-col gap-1">
                <NuxtLink
                    v-for="page in broken"
                    :key="page.path"
                    :to="page.to"
                    class="truncate font-mono text-xs hover:underline"
                >
                    {{ page.path }} → {{ page.links }}
                </NuxtLink>
            </div>
        </template>
    </UAlert>
</template>

<script setup lang="ts">
import { toCollectionPath } from "#layers/docs/shared/docPages.ts";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";

interface Props {
    pages: DocPage[];
}

const { pages } = defineProps<Props>();

const broken = computed(() =>
    pages
        .filter((page) => page.brokenLinks.length > 0)
        .map((page) => ({
            path: page.path,
            to: `/wiki${toCollectionPath(page.path)}`,
            links: page.brokenLinks.map((link) => link.href).join(", "),
        })),
);
</script>
