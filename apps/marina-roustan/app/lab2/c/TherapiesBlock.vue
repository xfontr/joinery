<!-- eslint-disable better-tailwindcss/no-unknown-classes -- throwaway lab -->
<template>
    <section id="ayuda" :class="{ sand }">
        <div class="k-wrap k-block">
            <div class="head">
                <h2 class="k-h2">En qué te puedo ayudar</h2>
                <NuxtLink v-if="!full" :to="`${base}/terapias`" class="more"
                    >Terapias y cómo trabajo <span aria-hidden="true">→</span></NuxtLink
                >
            </div>
            <ul class="concerns">
                <li v-for="item in concerns" :id="`tema-${slug(item.title)}`" :key="item.title">
                    <h3>{{ item.title }}</h3>
                    <p>{{ concernDetail[item.title] }}</p>
                    <NuxtLink v-if="full" to="#contacto" class="more"
                        >Cuéntame <span aria-hidden="true">→</span></NuxtLink
                    >
                </li>
            </ul>
            <div v-if="full" class="ways-row">
                <div class="ways">
                    <h3>Cómo trabajo</h3>
                    <dl>
                        <div v-for="item in therapies" :key="item.name">
                            <dt>{{ item.name }}</dt>
                            <dd>{{ item.line }}</dd>
                        </div>
                    </dl>
                </div>
                <aside class="legal">
                    <h3>¿Te deriva un juzgado o un abogado?</h3>
                    <p>
                        Hago coordinación de parentalidad e informes periciales, y los defiendo en
                        juicio.
                    </p>
                    <NuxtLink to="#contacto"
                        >Contactar sobre un caso <span aria-hidden="true">→</span></NuxtLink
                    >
                    <NuxtLink :to="`${base}/sobre-mi`"
                        >Ver mi trayectoria <span aria-hidden="true">→</span></NuxtLink
                    >
                </aside>
            </div>
        </div>
    </section>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes -->

<script setup lang="ts">
import { concernDetail, concerns, slug, therapies, useLabBase } from "../content";

const { sand = true, full = false } = defineProps<Props>();

const base = useLabBase();

interface Props {
    sand?: boolean;
    full?: boolean;
}
</script>

<style scoped>
.concerns h3,
.ways h3,
.legal h3 {
    font-family: "Young Serif", Georgia, serif;
    font-size: 1.375rem;
    line-height: 1.25;
    margin-bottom: 0.35rem;
}
.head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem 2rem;
}
.concerns {
    margin-top: 1.5rem;
    display: grid;
    gap: 2.75rem 3rem;
}
@media (min-width: 700px) {
    .concerns {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (min-width: 1000px) {
    .concerns {
        grid-template-columns: repeat(3, 1fr);
    }
}
.concerns li {
    scroll-margin-top: 1.5rem;
}
.concerns li:target {
    background: color-mix(in srgb, var(--sun) 35%, transparent);
    box-shadow: 0 0 0 0.75rem color-mix(in srgb, var(--sun) 35%, transparent);
}
.concerns p {
    color: var(--muted);
}
.ways-row {
    margin-top: 3rem;
    display: grid;
    gap: 1.25rem;
}
@media (min-width: 1000px) {
    .ways-row {
        grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    }
}
.legal {
    padding: 1.75rem;
    border-radius: 12px;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
}
.legal h3 {
    font-family: "Young Serif", Georgia, serif;
    font-size: 1.375rem;
    line-height: 1.25;
}
.legal p {
    font-size: 1rem;
    color: var(--muted);
    margin-bottom: 0.25rem;
}
.consulta .legal a {
    font-weight: 600;
    text-decoration: none;
}
.consulta .legal a:hover {
    text-decoration: underline;
}
.ways {
    padding: 1.75rem;
    background: #fff;
    border-radius: 12px;
}
.ways dl {
    margin-top: 0.75rem;
}
.ways dl div {
    display: grid;
    gap: 0.15rem 1.5rem;
    padding-block: 0.5rem;
}
@media (min-width: 560px) {
    .ways dl div {
        grid-template-columns: 12rem minmax(0, 1fr);
    }
}
.ways dt {
    font-weight: 600;
}
.ways dd {
    color: var(--muted);
    font-size: 1rem;
}
</style>
