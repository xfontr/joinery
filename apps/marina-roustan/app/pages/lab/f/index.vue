<template>
    <ShellF page="Inicio">
        <section data-dark>
            <div
                class="mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-center gap-10 px-5 pt-8 pb-24 md:px-10"
            >
                <h1 class="max-w-4xl text-5xl leading-none text-highlighted md:text-7xl">
                    {{ copy.title }}
                </h1>
                <p class="max-w-xl text-lg md:text-xl">{{ copy.sub }}</p>
                <div class="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <UButton
                        to="/lab/f/contacto"
                        color="neutral"
                        size="xl"
                        :label="copy.primary"
                        class="rounded-full px-10"
                    />
                    <a
                        :href="contact.phoneHref"
                        class="text-base text-highlighted underline underline-offset-4"
                    >
                        o llama al {{ contact.phone }}
                    </a>
                </div>
            </div>
        </section>

        <section class="bg-muted">
            <dl
                class="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-12 px-5 py-16 md:grid-cols-4 md:px-10 md:py-20"
            >
                <div v-for="item in facts" :key="item.label" class="flex flex-col gap-2">
                    <dt class="order-2 text-base">{{ item.label }}</dt>
                    <dd class="order-1 text-5xl font-semibold tracking-tight text-highlighted">
                        {{ item.figure }}
                    </dd>
                </div>
            </dl>
        </section>

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
            </div>
        </section>

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

        <section class="bg-muted">
            <div class="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-24 md:px-10 md:py-32">
                <h2 class="text-4xl text-highlighted md:text-6xl">{{ copy.voicesTitle }}</h2>
                <ul class="grid gap-6 md:grid-cols-3">
                    <li
                        v-for="item in testimonials"
                        :key="item.name"
                        :lang="item.lang"
                        class="flex flex-col justify-between gap-8 rounded-3xl bg-elevated p-8"
                    >
                        <p class="text-lg">«{{ item.text }}»</p>
                        <p class="font-semibold text-highlighted">{{ item.name }}</p>
                    </li>
                </ul>
            </div>
        </section>

        <section
            id="publicaciones"
            class="mx-auto grid max-w-7xl gap-12 px-5 pt-24 md:px-10 md:pt-32 lg:grid-cols-[1fr_2fr]"
        >
            <div class="flex flex-col gap-8">
                <h2 class="text-4xl text-highlighted md:text-6xl">{{ copy.writingTitle }}</h2>
                <div class="flex items-center gap-5">
                    <img
                        :src="book.image"
                        alt="Portada del libro"
                        width="500"
                        height="800"
                        class="w-24 shadow-lg"
                    />
                    <p class="text-base">
                        <span class="block font-semibold text-highlighted">{{ book.title }}</span>
                        Libro de la Dra. Roustan
                    </p>
                </div>
            </div>
            <ul>
                <li
                    v-for="post in recent"
                    :key="post.slug"
                    :lang="post.lang"
                    class="border-t border-default last:border-b"
                >
                    <span class="grid gap-1 py-5 md:grid-cols-[5rem_1fr]">
                        <span class="text-base text-muted">{{ year(post.date) }}</span>
                        <span class="text-lg font-medium text-highlighted">{{ post.title }}</span>
                    </span>
                </li>
            </ul>
        </section>

        <ContactF />
    </ShellF>
</template>

<script setup lang="ts">
import ContactF from "~/lab/f/ContactF.vue";
import ShellF from "~/lab/f/ShellF.vue";
import {
    areas,
    book,
    contact,
    copy,
    facts,
    hero,
    intro,
    posts,
    services,
    testimonials,
    year,
} from "~/lab/fixtures";

const recent = posts.slice(0, 5);
</script>
