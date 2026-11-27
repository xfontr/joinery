<!-- eslint-disable better-tailwindcss/no-unknown-classes -- throwaway lab -->
<template>
    <section id="cancer" class="dark">
        <div class="k-wrap k-block cancer">
            <img
                :src="book.image"
                :alt="`Portada del libro ${book.title}`"
                width="500"
                height="800"
                class="book"
            />
            <div class="text">
                <p v-if="kicker" class="kicker">Cáncer</p>
                <h2>Más de 15 años acompañando a quien vive un cáncer</h2>
                <p class="lead">
                    En sesiones individuales y en grupo, para afrontar lo que la enfermedad deja en
                    la vida y en el cuerpo.
                </p>
                <p>
                    Lo cuento en mi libro, <em>{{ book.title }}</em>: la resiliencia ante el cáncer
                    a partir de las historias de vida de cuatro mujeres.
                </p>
            </div>
        </div>
    </section>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes -->

<script setup lang="ts">
import { book } from "../content";

interface Props {
    kicker?: boolean;
}

withDefaults(defineProps<Props>(), { kicker: true });
</script>

<style scoped>
.dark {
    background: var(--ink);
    color: #d5dae6;
}
.cancer {
    display: grid;
    align-items: center;
    gap: 3rem;
}
@media (min-width: 768px) {
    .cancer {
        grid-template-columns: 1fr 1.5fr;
    }
}
.book {
    display: block;
    width: 12rem;
    height: auto;
    margin-inline: auto;
}
@media (min-width: 768px) {
    .book {
        width: 18rem;
    }
}
.text {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
.kicker {
    font-size: 1rem;
}
h2 {
    color: #fff;
    font-size: clamp(2.25rem, 5vw, 3.75rem);
    line-height: 1.1;
}
.lead {
    max-width: 36rem;
    font-size: 1.25rem;
}
.text p:last-child {
    max-width: 36rem;
}
</style>
