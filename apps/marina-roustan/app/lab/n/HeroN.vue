<template>
    <section
        class="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between gap-10 px-5 pt-8 pb-10 md:px-10 md:pt-10"
    >
        <p class="text-base text-muted">Dra. Marina Roustan — Psicóloga clínica en Barcelona</p>
        <h1 class="max-w-5xl text-5xl leading-none text-highlighted md:text-7xl lg:text-8xl">
            Cuando lo que sientes empieza a <em>pesar más</em> que lo que vives
        </h1>
        <div
            class="grid gap-8 border-t border-default pt-6 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_auto] lg:items-end lg:gap-12"
        >
            <p class="max-w-md text-lg md:text-xl">
                Terapia individual, de pareja y de grupo en el Eixample, con más de 25 años de
                consulta.
            </p>
            <figure :lang="voice.lang" class="flex flex-col gap-2 border-l-2 border-secondary pl-5">
                <blockquote class="text-lg text-highlighted">«{{ excerpt }}»</blockquote>
                <figcaption class="text-sm text-muted">{{ voice.name }}, paciente</figcaption>
            </figure>
            <div class="flex flex-col items-start gap-3 md:col-span-2 lg:col-span-1 lg:items-end">
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
    </section>
</template>

<script setup lang="ts">
import { contact, testimonials } from "../fixtures";

interface Props {
    base: string;
}

defineProps<Props>();

const voice = testimonials[1]!;
// The closing sentence of Joan Llibre's review, quoted word for word.
const excerpt = "Sin duda una terapeuta altamente recomendable.";
</script>
