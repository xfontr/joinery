<template>
    <main class="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-12 md:px-8">
        <header class="flex flex-col gap-2">
            <h1 class="text-4xl font-bold text-highlighted">Laboratorio de diseño</h1>
            <p class="text-lg font-light">
                Three directions for a new therapy site: the brand's navy, blue and ochre, real
                facts from the live site, home and contact only until one is picked.
            </p>
        </header>
        <section
            v-for="item in directions"
            :key="item.id"
            class="flex flex-col gap-3 border-t border-default pt-6"
        >
            <h2 class="text-h3 font-bold text-highlighted">
                {{ item.id.toUpperCase() }} · {{ item.name }}
            </h2>
            <p class="text-base">{{ item.idea }}</p>
            <ul class="flex flex-wrap gap-x-4 gap-y-2">
                <li v-for="page in labPages" :key="page.path">
                    <NuxtLink :to="`/lab/${item.id}${page.path}`" class="text-primary underline">
                        {{ page.name }}
                    </NuxtLink>
                </li>
            </ul>
        </section>
    </main>
</template>

<script setup lang="ts">
import { directions, labPages } from "~/lab/fixtures";

useHead({ title: "Laboratorio · Marina Roustan" });
</script>
