<template>
    <section
        class="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl gap-14 px-5 pt-8 pb-16 md:px-10 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-20"
    >
        <div class="flex flex-col gap-9">
            <p class="text-base text-muted">Psicóloga clínica en Barcelona</p>
            <h1 class="text-5xl leading-none text-highlighted md:text-7xl">
                Cuando lo que sientes empieza a <em>pesar más</em> que lo que vives
            </h1>
            <p class="max-w-lg text-lg md:text-xl">
                Terapia individual, de pareja y de grupo en el Eixample de Barcelona.
            </p>
            <div class="flex flex-wrap items-center gap-x-6 gap-y-4">
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
        <figure
            :lang="voice.lang"
            class="flex flex-col gap-5 border-l-2 border-secondary pl-6 lg:mt-24"
        >
            <blockquote data-display class="text-xl/snug text-highlighted md:text-2xl/snug">
                «{{ voice.text }}»
            </blockquote>
            <figcaption class="text-base">
                {{ voice.name }} · <span class="text-muted">paciente</span>
            </figcaption>
        </figure>
    </section>
</template>

<script setup lang="ts">
import { contact, testimonials } from "../fixtures";

interface Props {
    base: string;
}

defineProps<Props>();

const voice = testimonials[1]!;
</script>
