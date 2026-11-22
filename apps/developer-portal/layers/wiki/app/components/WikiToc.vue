<template>
    <aside
        v-if="links.length > 0"
        class="hidden w-56 shrink-0 overflow-x-hidden overflow-y-auto xl:block"
    >
        <!-- The stock root's negative margins and top padding assume a full-page docs layout -->
        <UContentToc
            :links
            highlight
            :ui="{
                root: 'static mx-0 max-h-none bg-transparent px-0 backdrop-blur-none sm:mx-0 sm:px-0',
                container: 'lg:py-0',
            }"
        />
    </aside>
</template>

<script setup lang="ts">
import type { TocLink } from "@nuxt/content";

interface Props {
    links: TocLink[];
}

const { links } = defineProps<Props>();
</script>
