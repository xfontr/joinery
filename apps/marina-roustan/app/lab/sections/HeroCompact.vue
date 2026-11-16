<template>
    <section
        class="mx-auto flex max-w-7xl flex-col items-center gap-8 px-5 pt-14 pb-20 text-center md:px-10 md:pt-20 md:pb-24"
    >
        <p class="text-base text-muted">Psicóloga clínica en Barcelona</p>
        <h1 class="max-w-4xl text-5xl leading-none text-highlighted md:text-7xl">
            Cuando lo que sientes empieza a <em>pesar más</em> que lo que vives
        </h1>
        <p class="max-w-xl text-lg md:text-xl">
            Terapia individual, de pareja y de grupo en el Eixample de Barcelona.
        </p>
        <div class="flex flex-col items-center gap-4">
            <UButton
                :to="`${base}/contacto`"
                color="neutral"
                size="xl"
                label="Pide una primera cita"
                class="rounded-full px-10"
            />
            <p class="flex gap-5 text-base">
                <a :href="contact.phoneHref" class="underline underline-offset-4">Llamar</a>
                <a :href="contact.whatsapp" class="underline underline-offset-4">WhatsApp</a>
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { contact } from "../fixtures";

interface Props {
    base: string;
}

defineProps<Props>();
</script>
