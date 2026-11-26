<!-- eslint-disable better-tailwindcss/no-unknown-classes, vue/max-lines-per-block -- throwaway lab -->
<template>
    <div class="idx">
        <header>
            <h1>Laboratorio 2 · {{ direction.name }}</h1>
            <p>{{ direction.idea }}</p>
            <p>{{ direction.look }}</p>
            <p class="links">
                <NuxtLink to="/lab2/c">Inicio</NuxtLink>
                <NuxtLink to="/lab2/c/trayectoria">Formación y trayectoria</NuxtLink>
                <NuxtLink to="/lab2/c/contacto">Contacto</NuxtLink>
            </p>
        </header>

        <section>
            <h2>Ronda 2</h2>
            <ul class="anti">
                <li v-for="row in changes" :key="row">{{ row }}</li>
            </ul>
        </section>

        <section>
            <h2>Dos preguntas</h2>
            <div v-for="item in decisions" :key="item.question" class="decision">
                <h3>{{ item.question }}</h3>
                <p>{{ item.answer }}</p>
            </div>
        </section>

        <section>
            <h2>Para confirmar con Marina</h2>
            <ul class="anti">
                <li v-for="row in toConfirm" :key="row">{{ row }}</li>
            </ul>
        </section>

        <section>
            <h2>Referencias</h2>
            <p>
                Diez webs de terapia analizadas el 26 nov 2026, con su ficha en
                <code>docs/benchmarks/</code>: Two Chairs, Therapy Warsaw y Q Psychology como
                referencias fuertes; Self Space, Twofold, AREF, Therapy in London, RewireMe, Maxima
                y Eftychia Papagianni por una idea cada una. El laboratorio anterior sigue en
                <NuxtLink to="/lab">/lab</NuxtLink>.
            </p>
        </section>
    </div>
</template>

<script setup lang="ts">
import { changes, decisions, direction, toConfirm } from "~/lab2/notes";

useHead({ title: "Laboratorio 2 · Marina Roustan" });
</script>
<!-- eslint-enable better-tailwindcss/no-unknown-classes, vue/max-lines-per-block -->

<style scoped>
.idx {
    max-width: 960px;
    margin: 0 auto;
    padding: 3rem 1.25rem 6rem;
    font-family: system-ui, sans-serif;
    font-size: 1.0625rem;
    line-height: 1.6;
    color: #1d2230;
    background: #fff;
}
:global(body:has(.idx)) {
    background: #fff;
}
h1 {
    font-size: 2.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
}
header p {
    max-width: 46rem;
    color: #4a5163;
}
a {
    color: #2c46a6;
}
section {
    margin-top: 3.5rem;
}
section > h2 {
    font-size: 1.375rem;
    font-weight: 700;
    margin-bottom: 1rem;
}
.dirs {
    display: grid;
    gap: 1.5rem;
}
@media (min-width: 860px) {
    .dirs {
        grid-template-columns: repeat(3, 1fr);
    }
}
article {
    border: 1px solid #dcdee5;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
}
article h2 {
    font-size: 1.5rem;
    font-weight: 700;
}
article h2 span {
    color: #8a90a0;
    margin-right: 0.25rem;
}
.idea {
    margin-top: 0.5rem;
}
article dl {
    margin-top: 1rem;
    font-size: 0.9375rem;
    color: #4a5163;
}
article dt {
    font-weight: 600;
    color: #1d2230;
    margin-top: 0.75rem;
}
.links {
    margin-top: auto;
    padding-top: 1.25rem;
    display: flex;
    gap: 1.25rem;
    font-weight: 600;
}
table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9875rem;
}
th,
td {
    text-align: left;
    vertical-align: top;
    padding: 0.75rem 1rem 0.75rem 0;
    border-top: 1px solid #e3e5ea;
}
th {
    font-weight: 600;
}
td:first-child {
    width: 58%;
}
header p + p {
    margin-top: 0.5rem;
}
.decision + .decision {
    margin-top: 1.5rem;
}
.decision h3 {
    font-weight: 600;
    margin-bottom: 0.25rem;
}
.anti {
    list-style: disc;
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}
</style>
