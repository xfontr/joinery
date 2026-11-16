<template>
    <ShellE page="Inicio">
        <section
            class="mx-auto flex min-h-[calc(100svh-6rem)] max-w-7xl flex-col items-center justify-center gap-10 px-5 pb-20 text-center md:px-10"
        >
            <p class="text-sm tracking-widest text-muted uppercase">
                Psicóloga clínica · Barcelona
            </p>
            <h1 class="max-w-5xl text-5xl leading-none text-highlighted md:text-7xl lg:text-8xl">
                Cuando lo que sientes empieza a <em>pesar más</em> que lo que vives
            </h1>
            <p class="max-w-xl text-lg md:text-xl">{{ copy.sub }}</p>
            <div class="flex flex-col items-center gap-4">
                <UButton
                    to="/lab/e/contacto"
                    color="neutral"
                    size="xl"
                    :label="copy.primary"
                    class="rounded-full px-10"
                />
                <a :href="contact.phoneHref" class="text-base underline underline-offset-4"
                    >o llama al {{ contact.phone }}</a
                >
            </div>
        </section>

        <section id="sobre-mi" class="border-t border-default">
            <div class="mx-auto grid max-w-7xl gap-16 px-5 pt-24 md:grid-cols-2 md:px-10 md:pt-32">
                <div class="flex flex-col gap-8 md:pb-32">
                    <h2 class="text-5xl leading-none text-highlighted md:text-7xl">
                        Hola, soy <em>Marina</em>
                    </h2>
                    <p v-for="line in intro.body" :key="line" class="text-lg md:text-xl">
                        {{ line }}
                    </p>
                    <ul class="flex flex-col border-t border-default">
                        <li
                            v-for="item in intro.credentials"
                            :key="item"
                            class="border-b border-default py-4 text-lg text-highlighted"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </div>
                <img
                    :src="hero.portrait"
                    alt="Retrato de la Dra. Marina Roustan"
                    width="319"
                    height="546"
                    class="mx-auto w-64 self-end md:w-80"
                />
            </div>
        </section>

        <section id="terapias" class="bg-muted">
            <div class="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-24 md:px-10 md:py-32">
                <h2 class="text-center text-5xl leading-none text-highlighted md:text-7xl">
                    {{ copy.therapiesTitle }}
                </h2>
                <ol class="grid gap-12 md:grid-cols-3 md:gap-10">
                    <li
                        v-for="(item, index) in services"
                        :key="item.title"
                        class="flex flex-col gap-4"
                    >
                        <span data-display class="text-5xl text-secondary italic">{{
                            index + 1
                        }}</span>
                        <h3 class="text-3xl text-highlighted">{{ item.title }}</h3>
                        <p class="text-lg">{{ item.lead }}</p>
                    </li>
                </ol>
                <p class="mx-auto max-w-3xl text-center text-lg">
                    <span class="text-muted">También trabajo con</span>
                    <template v-for="(item, index) in areas" :key="item.title">
                        {{ index ? " · " : " "
                        }}<span class="text-highlighted">{{ item.title }}</span>
                    </template>
                </p>
            </div>
        </section>

        <section
            class="mx-auto flex max-w-5xl flex-col items-center gap-16 px-5 py-24 text-center md:py-32"
        >
            <figure
                v-for="item in testimonials"
                :key="item.name"
                :lang="item.lang"
                class="flex flex-col items-center gap-6"
            >
                <blockquote class="text-3xl/snug text-highlighted italic md:text-4xl">
                    «{{ item.text }}»
                </blockquote>
                <figcaption class="text-sm tracking-widest text-muted uppercase">
                    {{ item.name }}
                </figcaption>
            </figure>
        </section>

        <section class="bg-inverted text-inverted">
            <div
                class="mx-auto grid max-w-6xl items-center gap-14 px-5 py-24 md:grid-cols-[1fr_1.4fr] md:px-10 md:py-32"
            >
                <img
                    :src="book.image"
                    alt="Portada del libro"
                    width="500"
                    height="800"
                    class="mx-auto w-48 shadow-2xl md:w-60"
                />
                <div class="flex flex-col gap-6">
                    <p class="text-sm tracking-widest uppercase">El libro</p>
                    <h2 class="text-5xl leading-none md:text-6xl">{{ book.title }}</h2>
                    <p class="max-w-lg text-lg md:text-xl">{{ book.body }}</p>
                </div>
            </div>
        </section>

        <section
            id="publicaciones"
            class="mx-auto flex max-w-5xl flex-col gap-12 px-5 py-24 md:px-10 md:py-32"
        >
            <h2 class="text-center text-5xl leading-none text-highlighted md:text-7xl">
                {{ copy.writingTitle }}
            </h2>
            <ul>
                <li
                    v-for="post in recent"
                    :key="post.slug"
                    :lang="post.lang"
                    class="border-t border-default last:border-b"
                >
                    <span class="flex items-baseline justify-between gap-6 py-6">
                        <span data-display class="text-2xl text-highlighted">{{ post.title }}</span>
                        <span class="text-base text-muted">{{ year(post.date) }}</span>
                    </span>
                </li>
            </ul>
        </section>

        <ContactE />
    </ShellE>
</template>

<script setup lang="ts">
import ContactE from "~/lab/e/ContactE.vue";
import ShellE from "~/lab/e/ShellE.vue";
import {
    areas,
    book,
    contact,
    copy,
    hero,
    intro,
    posts,
    services,
    testimonials,
    year,
} from "~/lab/fixtures";

const recent = posts.slice(0, 5);
</script>
