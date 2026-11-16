<template>
    <section
        id="terapias"
        class="mx-auto flex max-w-7xl flex-col gap-12 px-5 pb-24 md:px-10 md:pb-32"
        :class="[afterHero ? 'pt-0' : 'pt-24 md:pt-32']"
    >
        <div class="flex flex-col gap-4">
            <h2 class="text-4xl text-highlighted md:text-6xl">¿Qué te trae?</h2>
            <p class="max-w-xl text-lg md:text-xl">
                Elige lo que más se parezca a lo que vives y empezamos por ahí.
            </p>
        </div>
        <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <li v-for="item in concerns" :key="item.topic">
                <NuxtLink
                    :to="{ path: `${base}/contacto`, query: { motivo: item.topic } }"
                    class="group flex h-full flex-col gap-3 rounded-2xl border border-default bg-elevated p-6 transition hover:border-accented md:p-8"
                >
                    <h3 class="text-2xl text-highlighted">{{ item.title }}</h3>
                    <p class="flex-1 text-lg">{{ item.body }}</p>
                    <span
                        class="text-base text-highlighted underline-offset-4 group-hover:underline"
                    >
                        Escríbeme sobre esto →
                    </span>
                </NuxtLink>
            </li>
        </ul>
        <div
            class="flex flex-col gap-6 border-t border-default pt-8 md:flex-row md:justify-between md:gap-12"
        >
            <p class="max-w-xl text-lg">
                Trabajo en sesiones individuales, de pareja y de grupo. El grupo es un espacio para
                cuidar de uno mismo y de los demás por medio de la palabra.
            </p>
            <p class="max-w-md text-base text-muted">
                ¿Te deriva un juzgado o eres profesional? También hago coordinación de parentalidad
                y psicología forense.
                <NuxtLink
                    :to="{ path: `${base}/contacto`, query: { motivo: 'Familia y parentalidad' } }"
                    class="text-highlighted underline underline-offset-4"
                >
                    Contactar
                </NuxtLink>
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { concerns } from "../fixtures";

interface Props {
    base: string;
    afterHero?: boolean;
}

defineProps<Props>();
</script>
