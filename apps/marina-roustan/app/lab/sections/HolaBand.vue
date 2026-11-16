<template>
    <section id="sobre-mi" class="bg-muted">
        <div
            class="mx-auto grid max-w-7xl gap-12 px-5 pt-24 md:grid-cols-[2fr_3fr] md:px-10 md:pt-32"
        >
            <img
                :src="hero.portrait"
                alt="Retrato de la Dra. Marina Roustan"
                width="319"
                height="546"
                class="order-2 mx-auto w-64 self-end md:order-1 md:w-80"
            />
            <div class="order-1 flex flex-col gap-8 md:order-2 md:pb-32">
                <h2 class="text-4xl text-highlighted md:text-6xl">Hola, soy Marina</h2>
                <p v-for="line in intro.body" :key="line" class="max-w-2xl text-lg md:text-xl">
                    {{ line }}
                </p>
                <footer class="flex flex-col gap-1">
                    <p data-display class="text-3xl text-highlighted">{{ contact.name }}</p>
                    <p class="text-base text-muted">{{ degrees }}</p>
                </footer>
                <div
                    class="flex flex-wrap items-end justify-between gap-x-10 gap-y-8 border-t border-default pt-8"
                >
                    <NuxtLink
                        v-if="publications"
                        to="#publicaciones"
                        class="text-lg underline underline-offset-4"
                    >
                        Autora de un libro y de {{ posts.length }} artículos
                    </NuxtLink>
                    <dl v-else class="flex gap-10">
                        <div v-for="item in figures" :key="item.label" class="flex flex-col">
                            <dt class="order-2 text-base text-muted">{{ item.label }}</dt>
                            <dd data-display class="order-1 text-4xl text-highlighted">
                                {{ item.figure }}
                            </dd>
                        </div>
                    </dl>
                    <UButton
                        :to="`${base}/contacto`"
                        color="neutral"
                        size="xl"
                        label="Escríbeme"
                        class="rounded-full px-8"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { contact, hero, intro, posts } from "../fixtures";

interface Props {
    base: string;
    publications?: boolean;
}

defineProps<Props>();

const degrees = [
    "Doctorado magna cum laude (UAB)",
    "máster en neurociencias (UOC)",
    "máster en grupoanálisis (UD)",
].join(" · ");

const figures = [
    { figure: "+25", label: "años de consulta" },
    { figure: "+200", label: "pacientes" },
];
</script>
