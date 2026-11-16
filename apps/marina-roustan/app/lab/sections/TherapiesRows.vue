<template>
    <section id="terapias" class="border-t border-default">
        <div class="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-24 md:px-10 md:py-32">
            <h2 class="text-4xl text-highlighted md:text-6xl">{{ copy.therapiesTitle }}</h2>
            <ul>
                <li
                    v-for="item in services"
                    :key="item.title"
                    class="grid gap-3 border-t border-default py-8 last:border-b md:grid-cols-[1fr_1.5fr] md:gap-10"
                >
                    <h3 class="text-2xl text-highlighted md:text-3xl">{{ item.title }}</h3>
                    <p class="text-lg">{{ item.lead }}</p>
                </li>
            </ul>
            <ul class="flex flex-wrap gap-2" aria-label="También trabajo con">
                <li
                    v-for="item in areas"
                    :key="item.title"
                    class="rounded-full border border-default px-4 py-2 text-base"
                >
                    {{ item.title }}
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup lang="ts">
import { areas, copy, services } from "../fixtures";
</script>
