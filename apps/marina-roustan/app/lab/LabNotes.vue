<template>
    <aside class="border-t-4 border-accented bg-elevated px-4 py-6 text-sm text-toned md:px-8">
        <div class="mx-auto flex max-w-6xl flex-col gap-4">
            <p>
                <strong class="text-highlighted">Lab · {{ current.name }}</strong>
                — {{ current.idea }}
            </p>
            <nav class="flex flex-wrap gap-x-4 gap-y-2" aria-label="Direcciones">
                <NuxtLink
                    v-for="item in directions"
                    :key="item.id"
                    :to="`/lab/${item.id}${pagePath}`"
                    :class="
                        item.id === direction
                            ? 'font-bold text-highlighted'
                            : 'text-primary underline'
                    "
                >
                    {{ item.id.toUpperCase() }} · {{ item.name }}
                </NuxtLink>
            </nav>
            <nav class="flex flex-wrap gap-x-4 gap-y-2" aria-label="Páginas del laboratorio">
                <NuxtLink
                    v-for="item in labPages"
                    :key="item.path"
                    :to="`/lab/${direction}${item.path}`"
                    :class="
                        item.path === pagePath
                            ? 'font-bold text-highlighted'
                            : 'text-primary underline'
                    "
                >
                    {{ item.name }}
                </NuxtLink>
                <NuxtLink to="/lab" class="text-primary underline">Índice</NuxtLink>
            </nav>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { directions, labPages, type Direction } from "./fixtures";

interface Props {
    direction: Direction;
    page: string;
}

const props = defineProps<Props>();

const route = useRoute();
const current = computed(() => directions.find((item) => item.id === props.direction)!);
const pagePath = computed(() => route.path.replace(/^\/lab\/[^/]+/, ""));

useHead({ title: () => `${props.page} · ${current.value.name} · Laboratorio Marina Roustan` });
</script>
