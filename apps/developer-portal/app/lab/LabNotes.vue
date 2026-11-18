<template>
    <aside class="border-t border-default px-4 py-6 text-sm md:px-8">
        <div class="mx-auto flex max-w-6xl flex-col gap-3">
            <p>
                <strong>Lab · {{ label }}</strong>
                — {{ current.idea }}
            </p>
            <p>Faces: {{ current.faces }}. From: {{ current.refs }}.</p>
            <p>W8 figure: {{ current.figure }}.</p>
            <p>{{ dropped }}</p>
            <nav class="flex flex-wrap gap-x-4 gap-y-2" aria-label="Directions">
                <NuxtLink
                    v-for="item in siblings"
                    :key="item.id"
                    :to="`/lab/${item.id}${pagePath}`"
                    class="underline"
                >
                    {{ item.id.toUpperCase() }} · {{ item.name }}
                </NuxtLink>
                <span aria-hidden="true">|</span>
                <NuxtLink
                    v-for="item in pages"
                    :key="item.path"
                    :to="`/lab/${direction}${item.path}`"
                    class="underline"
                >
                    {{ item.name }}
                </NuxtLink>
            </nav>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { directions, dropped, labPages, type Direction } from "./directions";

interface Props {
    direction: Direction;
    page: string;
}

const props = defineProps<Props>();

const route = useRoute();
const current = computed(() => directions.find((item) => item.id === props.direction)!);
const label = computed(() => `${current.value.id.toUpperCase()} ${current.value.name}`);
const pages = labPages;
const pagePath = computed(() => route.path.replace(/^\/lab\/[^/]+/, ""));
const siblings = computed(() =>
    labPages.some((page) => page.path === pagePath.value) ? directions : [],
);

useHead({
    title: () => `${props.page} · ${current.value.name} · Lab`,
    link: [
        {
            rel: "stylesheet",
            href: `https://fonts.googleapis.com/css2?${current.value.fonts}&display=swap`,
        },
    ],
});
</script>
