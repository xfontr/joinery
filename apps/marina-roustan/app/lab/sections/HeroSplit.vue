<template>
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
                    :to="`${base}/contacto`"
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
</template>

<script setup lang="ts">
import { contact, copy } from "../fixtures";

interface Props {
    base: string;
}

defineProps<Props>();
</script>
