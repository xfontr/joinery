<template>
    <section
        class="mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col items-center justify-center gap-10 px-5 pb-20 text-center md:px-10"
    >
        <p class="text-sm tracking-widest text-muted uppercase">
            Dra. Marina Roustan · Psicóloga clínica · Barcelona
        </p>
        <h1 class="max-w-5xl text-5xl leading-none text-highlighted md:text-7xl lg:text-8xl">
            Cuando lo que sientes empieza a <em>pesar más</em> que lo que vives
        </h1>
        <p class="max-w-xl text-lg md:text-xl">{{ copy.sub }}</p>
        <div class="flex flex-col items-center gap-4">
            <UButton
                :to="`${base}/contacto`"
                color="neutral"
                size="xl"
                :label="copy.primary"
                class="rounded-full px-10"
            />
            <a :href="contact.phoneHref" class="text-base underline underline-offset-4">
                o llama al {{ contact.phone }}
            </a>
        </div>
    </section>
</template>

<script setup lang="ts">
import { contact, copy } from "../fixtures";

interface Props {
    base: string;
}

defineProps<Props>();
</script>
