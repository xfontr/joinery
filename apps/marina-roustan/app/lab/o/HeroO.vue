<template>
    <section
        class="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-12 px-5 py-10 md:px-10 md:py-14"
    >
        <div class="flex flex-col gap-8">
            <p class="text-base text-muted">Psicóloga clínica en Barcelona</p>
            <h1 class="max-w-5xl text-5xl leading-none text-highlighted md:text-7xl">
                Cuando lo que sientes empieza a <em>pesar más</em> que lo que vives
            </h1>
        </div>
        <div
            class="grid gap-10 border-t border-default pt-8 lg:grid-cols-2 lg:items-start lg:gap-20"
        >
            <div class="flex flex-col gap-6">
                <p class="max-w-md text-lg md:text-xl">
                    Terapia individual, de pareja y de grupo en el Eixample de Barcelona.
                </p>
                <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <UButton
                        :to="`${base}/contacto`"
                        color="neutral"
                        size="xl"
                        label="Pide una primera cita"
                        class="rounded-full px-8"
                    />
                    <a :href="contact.whatsapp" class="text-base underline underline-offset-4">
                        o escríbeme por WhatsApp
                    </a>
                </div>
            </div>
            <figure :lang="voice.lang" class="flex flex-col gap-3 border-l-2 border-secondary pl-6">
                <blockquote class="text-xl/snug text-highlighted md:text-2xl/snug">
                    «Representa para mí un gran <em>apoyo, psicológico y humano</em>.»
                </blockquote>
                <figcaption class="text-sm text-muted">{{ voice.name }}, paciente</figcaption>
            </figure>
        </div>
    </section>
</template>

<script setup lang="ts">
import { contact, testimonials } from "../fixtures";

interface Props {
    base: string;
}

defineProps<Props>();

const voice = testimonials[0]!;
</script>
