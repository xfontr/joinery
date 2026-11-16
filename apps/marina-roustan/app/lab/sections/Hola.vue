<template>
    <section
        id="sobre-mi"
        class="mx-auto grid max-w-7xl gap-12 px-5 pt-24 md:grid-cols-[2fr_3fr] md:px-10 md:pt-32"
    >
        <img
            :src="hero.portrait"
            alt="Retrato de la Dra. Marina Roustan"
            width="319"
            height="546"
            class="order-2 mx-auto w-64 self-end md:order-1 md:w-80"
        />
        <div class="order-1 flex flex-col justify-center gap-6 md:order-2 md:pb-32">
            <h2 class="text-4xl text-highlighted md:text-6xl">Hola, soy Marina</h2>
            <p v-for="line in intro.body" :key="line" class="max-w-2xl text-lg md:text-xl">
                {{ line }}
            </p>
            <ul class="flex flex-wrap gap-2">
                <li
                    v-for="item in intro.credentials"
                    :key="item"
                    class="rounded-full bg-muted px-4 py-2 text-sm font-medium text-highlighted"
                >
                    {{ item }}
                </li>
            </ul>
            <div v-if="base" class="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                <UButton
                    :to="`${base}/contacto`"
                    color="neutral"
                    size="xl"
                    label="Escríbeme"
                    class="rounded-full px-8"
                />
                <span class="text-base text-muted">
                    Autora de un libro y de {{ posts.length }} artículos
                </span>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { hero, intro, posts } from "../fixtures";

interface Props {
    base?: string;
}

defineProps<Props>();
</script>
