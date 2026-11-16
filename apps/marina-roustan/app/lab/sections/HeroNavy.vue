<template>
    <section data-dark>
        <div
            class="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl gap-16 px-5 pt-8 pb-16 md:px-10 lg:grid-cols-[3fr_2fr] lg:items-end"
        >
            <div class="flex flex-col justify-center gap-10 self-center">
                <h1 class="max-w-4xl text-5xl leading-none text-highlighted md:text-7xl">
                    {{ copy.title }}
                </h1>
                <p class="max-w-xl text-lg md:text-xl">{{ copy.sub }}</p>
                <div class="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <UButton
                        :to="`${base}/contacto`"
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
            <figure :lang="voice.lang" class="flex flex-col gap-5 border-l-2 border-secondary pl-6">
                <blockquote class="text-xl/snug text-highlighted md:text-2xl">
                    «{{ voice.text }}»
                </blockquote>
                <figcaption class="text-base">
                    {{ voice.name }} · <span class="text-muted">paciente</span>
                </figcaption>
                <p class="mt-4 text-sm text-muted">
                    Consulta en {{ contact.address }}, {{ contact.city }}
                </p>
            </figure>
        </div>
    </section>
</template>

<script setup lang="ts">
import { contact, copy, testimonials } from "../fixtures";

interface Props {
    base: string;
}

defineProps<Props>();

const voice = testimonials[1]!;
</script>
