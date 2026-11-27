<!-- eslint-disable better-tailwindcss/no-unknown-classes, vue/max-lines-per-block -- throwaway lab -->
<template>
    <ConsultaShell page="sobre-mi">
        <section class="top">
            <div class="k-wrap top-grid">
                <figure class="portrait">
                    <img :src="portrait" alt="Marina Roustan" width="319" height="546" />
                </figure>
                <div>
                    <h1>Sobre mí</h1>
                    <p v-for="line in intro.body" :key="line" class="lead">{{ line }}</p>
                    <dl class="facts">
                        <div v-for="item in credentials" :key="item.label">
                            <dt>{{ item.label }}</dt>
                            <dd>{{ item.value }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </section>

        <section class="k-wrap k-block sheet">
            <h2 class="k-h2">Experiencia</h2>
            <ul class="work">
                <li v-for="item in trajectory.work" :key="item.title">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.text }}</p>
                </li>
            </ul>
        </section>

        <section class="sand">
            <div class="k-wrap k-block sheet">
                <h2 class="k-h2">Formación</h2>
                <ol class="years">
                    <li v-for="item in education" :key="item.text">
                        <span class="year">{{ item.year }}</span>
                        <span>{{ item.text }}</span>
                    </li>
                </ol>
            </div>
        </section>

        <section class="k-wrap k-block sheet">
            <h2 class="k-h2">Publicaciones</h2>
            <ol class="years">
                <li v-for="item in trajectory.publications" :key="item.text">
                    <span class="year">{{ item.year }}</span>
                    <span>{{ item.text }}</span>
                </li>
            </ol>
            <p class="member">{{ trajectory.memberships }}</p>
        </section>

        <section class="sand">
            <div class="k-wrap k-block sheet">
                <h2 class="k-h2">El currículum completo</h2>
                <div>
                    <p class="cv-lead">
                        Con cursos, ponencias y congresos desde 1996. Lo suelen pedir abogados y
                        juzgados.
                    </p>
                    <a :href="cvUrl" class="k-button outline" target="_blank" rel="noopener"
                        >Descargar el CV (PDF, 7 páginas)</a
                    >
                </div>
            </div>
        </section>
    </ConsultaShell>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes, vue/max-lines-per-block -->

<script setup lang="ts">
import ConsultaShell from "~/lab2/c/ConsultaShell.vue";
import { credentials, cvUrl, intro, portrait, trajectory } from "~/lab2/content";

const education = trajectory.education.toSorted((a, b) => b.year.localeCompare(a.year));

useHead({ title: "C · Consulta · Sobre mí · Lab 2" });
</script>

<style scoped>
.top {
    background: var(--sun);
    padding-block: 3rem 3.5rem;
}
@media (min-width: 900px) {
    .top {
        padding-block: 4.5rem 5rem;
    }
}
.top-grid {
    display: grid;
    gap: 2.5rem;
}
@media (min-width: 900px) {
    .top-grid {
        grid-template-columns: 20rem minmax(0, 44rem);
        gap: 5rem;
        align-items: end;
    }
}
.top {
    padding-bottom: 0;
}
.top-grid > div {
    padding-bottom: 3.5rem;
}
.portrait {
    align-self: end;
    background: #fff;
    border-radius: 50% 50% 0 0 / 9rem 9rem 0 0;
    padding: 2rem 2rem 0;
    width: min(100%, 20rem);
}
.portrait img {
    display: block;
    width: 80%;
    height: auto;
    margin: 0 auto;
}
.cv-lead {
    margin-bottom: 1.25rem;
    max-width: 34rem;
}
h1 {
    font-size: clamp(2.375rem, 5vw, 3.5rem);
    line-height: 1.08;
    max-width: 14ch;
}
.lead {
    margin-top: 1rem;
    max-width: 40rem;
}
.facts {
    margin-top: 1.75rem;
}
.facts {
    background: #fff;
    border-radius: 12px;
    padding: 0.5rem 1.5rem;
}
.facts div {
    display: grid;
    grid-template-columns: 9.5rem 1fr;
    gap: 1rem;
    padding-block: 0.7rem;
    font-size: 1rem;
}
.facts div + div {
    border-top: 1px solid var(--line);
}
.facts dt {
    font-weight: 600;
}
.facts dd {
    color: var(--muted);
}
@media (max-width: 520px) {
    .facts div {
        grid-template-columns: 1fr;
        gap: 0;
    }
}
.sheet {
    display: grid;
    gap: 1.5rem;
}
@media (min-width: 900px) {
    .sheet {
        grid-template-columns: 16rem minmax(0, 46rem);
        gap: 4rem;
    }
}
.work {
    display: grid;
    gap: 1.75rem;
}
@media (min-width: 700px) {
    .work {
        grid-template-columns: 1fr 1fr;
        gap: 2rem 2.5rem;
    }
}
.work li {
    padding-top: 1rem;
    border-top: 1.5px solid var(--ink);
}
.work h3 {
    font-family: "Young Serif", Georgia, serif;
    font-size: 1.3125rem;
    line-height: 1.25;
    margin-bottom: 0.35rem;
}
.work p {
    color: var(--muted);
}
.years li {
    display: grid;
    grid-template-columns: 4rem 1fr;
    gap: 1rem;
    padding-block: 0.75rem;
    border-top: 1px solid var(--line);
}
.sand .years li {
    border-color: #ddd6c6;
}
.year {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}
.member {
    grid-column: 2;
    margin-top: 1rem;
    color: var(--muted);
    font-size: 1rem;
}
@media (max-width: 899px) {
    .member {
        grid-column: auto;
    }
}
.sand {
    background: var(--sand);
}
</style>
