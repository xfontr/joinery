<template>
    <section data-dark>
        <div
            class="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-[1fr_1.5fr] md:px-10 md:py-32"
        >
            <img
                :src="book.image"
                :alt="`Portada del libro ${book.title}`"
                width="500"
                height="800"
                class="mx-auto w-48 drop-shadow-2xl md:w-72"
            />
            <div class="flex flex-col gap-6">
                <p class="text-base">Cáncer</p>
                <h2 class="text-4xl text-highlighted md:text-6xl">
                    Más de 15 años acompañando a quien vive un cáncer
                </h2>
                <p class="max-w-xl text-lg md:text-xl">
                    En sesiones individuales y en grupo, para afrontar lo que la enfermedad deja en
                    la vida y en el cuerpo.
                </p>
                <p class="max-w-xl text-lg">
                    Lo cuento en mi libro, <em>{{ book.title }}</em
                    >: la resiliencia ante el cáncer a partir de las historias de vida de cuatro
                    mujeres.
                </p>
                <UButton
                    :to="{ path: `${base}/contacto`, query: { motivo: 'Cáncer' } }"
                    color="neutral"
                    size="xl"
                    label="Hablar de tu caso"
                    class="mt-2 self-start rounded-full px-8"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { book } from "../fixtures";

interface Props {
    base: string;
}

defineProps<Props>();
</script>
