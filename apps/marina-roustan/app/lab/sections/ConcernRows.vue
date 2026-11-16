<template>
    <section
        id="terapias"
        class="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[1fr_2fr]"
    >
        <div class="flex flex-col gap-5 lg:sticky lg:top-10 lg:self-start">
            <h2 class="text-4xl/tight text-highlighted md:text-6xl">¿Qué te trae?</h2>
            <p class="max-w-sm text-lg">
                Elige lo que más se parezca a lo que vives y empezamos por ahí.
            </p>
        </div>
        <div class="flex flex-col">
            <NuxtLink
                v-for="item in concerns"
                :key="item.topic"
                :to="{ path: `${base}/contacto`, query: { motivo: item.topic } }"
                class="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2 border-t border-default py-6 last:border-b"
            >
                <span class="text-2xl tracking-tight text-highlighted md:text-3xl">{{
                    item.title
                }}</span>
                <span
                    class="row-span-2 self-center text-2xl text-muted transition group-hover:translate-x-1 group-hover:text-highlighted"
                    aria-hidden="true"
                >
                    →
                </span>
                <span class="text-lg text-muted">{{ item.body }}</span>
            </NuxtLink>
            <div class="mt-10 grid gap-6 md:grid-cols-2 md:gap-10">
                <p class="text-lg">
                    Trabajo en sesiones individuales, de pareja y de grupo, en la consulta del
                    Eixample.
                </p>
                <div class="flex flex-col items-start gap-3 rounded-2xl bg-muted p-6">
                    <p class="text-lg text-highlighted">¿Te deriva un juzgado o un abogado?</p>
                    <p class="text-base">
                        También hago coordinación de parentalidad y psicología forense.
                    </p>
                    <NuxtLink
                        :to="{
                            path: `${base}/contacto`,
                            query: { motivo: 'Familia y parentalidad' },
                        }"
                        class="text-base text-highlighted underline underline-offset-4"
                    >
                        Contactar sobre un caso
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { concerns } from "../fixtures";

interface Props {
    base: string;
}

defineProps<Props>();
</script>
