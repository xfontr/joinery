<template>
    <ShellD page="Inicio">
        <section
            class="mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-between gap-16 px-5 pt-10 pb-12 md:px-10 md:pt-16"
        >
            <p class="text-base text-muted">Dra. Marina Roustan — Psicóloga clínica en Barcelona</p>
            <h1 class="max-w-5xl text-5xl leading-none text-highlighted md:text-7xl lg:text-8xl">
                {{ copy.title }}
            </h1>
            <div
                class="flex flex-col gap-8 border-t border-default pt-8 md:flex-row md:items-end md:justify-between"
            >
                <p class="max-w-lg text-lg md:text-xl">{{ copy.sub }}</p>
                <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <UButton
                        to="/lab/d/contacto"
                        color="neutral"
                        size="xl"
                        :label="copy.primary"
                        class="rounded-full px-8"
                    />
                    <a :href="contact.phoneHref" class="text-base underline underline-offset-4">
                        o llama al {{ contact.phone }}
                    </a>
                </div>
            </div>
        </section>

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
                    <h2 class="text-4xl/tight text-highlighted md:text-6xl">Hola, soy Marina.</h2>
                    <p v-for="line in intro.body" :key="line" class="max-w-2xl text-lg md:text-xl">
                        {{ line }}
                    </p>
                    <dl class="grid grid-cols-2 gap-8 border-t border-default pt-8">
                        <div v-for="item in facts" :key="item.label" class="flex flex-col gap-1">
                            <dt class="order-2 text-base text-muted">{{ item.label }}</dt>
                            <dd
                                class="order-1 text-4xl font-medium tracking-tight text-highlighted"
                            >
                                {{ item.figure }}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </section>

        <section
            id="terapias"
            class="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[1fr_2fr]"
        >
            <div class="flex flex-col gap-4 lg:sticky lg:top-10 lg:self-start">
                <h2 class="text-4xl/tight text-highlighted md:text-6xl">
                    {{ copy.therapiesTitle }}
                </h2>
            </div>
            <div class="flex flex-col">
                <details
                    v-for="item in services"
                    :key="item.title"
                    class="group border-t border-default py-6 last-of-type:border-b"
                >
                    <summary
                        class="flex cursor-pointer list-none items-baseline justify-between gap-6"
                    >
                        <span class="flex flex-col gap-2">
                            <span
                                class="text-2xl font-medium tracking-tight text-highlighted md:text-3xl"
                            >
                                {{ item.title }}
                            </span>
                            <span class="text-lg text-muted">{{ item.lead }}</span>
                        </span>
                        <span
                            class="text-2xl text-muted transition group-open:rotate-45"
                            aria-hidden="true"
                            >+</span
                        >
                    </summary>
                    <p class="mt-4 max-w-2xl text-lg">{{ item.body }}</p>
                </details>
                <p class="mt-10 text-lg">
                    <span class="text-muted">También trabajo con</span>
                    <template v-for="(item, index) in areas" :key="item.title">
                        {{ index ? " · " : " "
                        }}<span class="text-highlighted">{{ item.title }}</span>
                    </template>
                </p>
            </div>
        </section>

        <section class="bg-inverted text-inverted">
            <div
                class="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-[1fr_1.5fr] md:px-10 md:py-32"
            >
                <img
                    :src="book.image"
                    alt="Portada del libro"
                    width="500"
                    height="800"
                    class="mx-auto w-48 shadow-2xl md:w-64"
                />
                <div class="flex flex-col gap-6">
                    <p class="text-base">Libro de la Dra. Roustan</p>
                    <h2 class="text-4xl/tight md:text-6xl">{{ book.title }}</h2>
                    <p class="max-w-xl text-lg md:text-xl">{{ book.body }}</p>
                </div>
            </div>
        </section>

        <section class="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-24 md:px-10 md:py-32">
            <h2 class="text-4xl/tight text-highlighted md:text-6xl">
                {{ copy.voicesTitle }}
            </h2>
            <div class="grid gap-16 lg:grid-cols-[3fr_2fr]">
                <figure :lang="first.lang" class="flex flex-col gap-6">
                    <blockquote
                        class="text-2xl/snug font-medium tracking-tight text-highlighted md:text-4xl"
                    >
                        «{{ first.text }}»
                    </blockquote>
                    <figcaption class="text-base text-muted">{{ first.name }}</figcaption>
                </figure>
                <div class="flex flex-col gap-10">
                    <figure
                        v-for="item in others"
                        :key="item.name"
                        :lang="item.lang"
                        class="flex flex-col gap-3 border-t border-default pt-6"
                    >
                        <blockquote class="text-lg">«{{ item.text }}»</blockquote>
                        <figcaption class="text-base text-muted">{{ item.name }}</figcaption>
                    </figure>
                </div>
            </div>
        </section>

        <section
            id="publicaciones"
            class="mx-auto flex max-w-7xl flex-col gap-10 px-5 pb-24 md:px-10 md:pb-32"
        >
            <h2 class="text-4xl/tight text-highlighted md:text-6xl">
                {{ copy.writingTitle }}
            </h2>
            <ul>
                <li
                    v-for="post in recent"
                    :key="post.slug"
                    :lang="post.lang"
                    class="border-t border-default last:border-b"
                >
                    <span class="grid gap-1 py-5 md:grid-cols-[6rem_1fr]">
                        <span class="text-base text-muted">{{ year(post.date) }}</span>
                        <span class="text-xl text-highlighted">{{ post.title }}</span>
                    </span>
                </li>
            </ul>
        </section>

        <ContactD />
    </ShellD>
</template>

<script setup lang="ts">
import ContactD from "~/lab/d/ContactD.vue";
import ShellD from "~/lab/d/ShellD.vue";
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

const [first, ...others] = [testimonials[1]!, testimonials[0]!, ...testimonials.slice(2)];
const recent = posts.slice(0, 5);
</script>
