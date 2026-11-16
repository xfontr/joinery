<template>
    <section
        id="terapias"
        class="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[1fr_2fr]"
    >
        <h2 class="text-4xl/tight text-highlighted md:text-6xl lg:sticky lg:top-10 lg:self-start">
            {{ copy.therapiesTitle }}
        </h2>
        <div class="flex flex-col">
            <details
                v-for="item in services"
                :key="item.title"
                class="group border-t border-default py-6 last-of-type:border-b"
            >
                <summary class="flex cursor-pointer list-none items-baseline justify-between gap-6">
                    <span class="flex flex-col gap-2">
                        <span
                            data-display
                            class="text-2xl tracking-tight text-highlighted md:text-3xl"
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
            <ul class="mt-10 flex flex-wrap gap-2" aria-label="También trabajo con">
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
