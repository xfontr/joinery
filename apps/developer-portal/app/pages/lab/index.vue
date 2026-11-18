<template>
    <main class="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
        <h1 class="text-3xl font-semibold">Portal design lab</h1>
        <p>The approved direction on real portal data. Design only; never deployed.</p>
        <section
            v-for="item in directions"
            :key="item.id"
            class="flex flex-col gap-2 border-t border-default pt-4"
        >
            <h2 class="text-xl font-semibold">{{ item.id.toUpperCase() }} · {{ item.name }}</h2>
            <p>{{ item.idea }}</p>
            <ul class="flex gap-4">
                <li v-for="page in labPages" :key="page.path">
                    <NuxtLink :to="`/lab/${item.id}${page.path}`" class="underline">
                        {{ page.name }}
                    </NuxtLink>
                </li>
            </ul>
        </section>
    </main>
</template>

<script setup lang="ts">
import { directions, labPages } from "~/lab/directions";

definePageMeta({ layout: false });
</script>
