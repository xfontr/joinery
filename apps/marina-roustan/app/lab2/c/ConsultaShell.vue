<!-- eslint-disable better-tailwindcss/no-unknown-classes -- throwaway lab -->
<template>
    <div class="consulta" :class="{ marina: base === '/lab2/d' }">
        <header class="k-head">
            <div class="k-wrap k-head-row">
                <NuxtLink :to="base" class="k-mark">Marina Roustan</NuxtLink>
                <nav class="k-nav" aria-label="Principal">
                    <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{
                        item.label
                    }}</NuxtLink>
                </nav>
                <div class="k-head-actions">
                    <NuxtLink :to="`${base}/contacto`" class="k-button">Pide cita</NuxtLink>
                    <details class="k-menu">
                        <summary>Menú</summary>
                        <nav aria-label="Principal">
                            <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{
                                item.label
                            }}</NuxtLink>
                            <a :href="contact.phoneHref">{{ contact.phone }}</a>
                        </nav>
                    </details>
                </div>
            </div>
        </header>

        <main>
            <slot />
        </main>

        <footer class="k-foot">
            <div class="k-wrap">
                <div class="k-foot-grid">
                    <div class="k-foot-brand">
                        <p class="k-foot-name">Marina Roustan</p>
                        <p>Psicóloga clínica en Barcelona</p>
                        <p class="k-foot-creds">Colegiada 7538 COPC · {{ contact.registry }}</p>
                        <NuxtLink :to="`${base}/contacto`" class="k-foot-cta">Pide cita</NuxtLink>
                    </div>
                    <div>
                        <p class="k-foot-label">Consulta</p>
                        <p>{{ contact.address }}</p>
                        <p>{{ contact.city }}</p>
                        <p>
                            <a :href="mapsUrl" target="_blank" rel="noopener">Cómo llegar</a>
                        </p>
                    </div>
                    <div>
                        <p class="k-foot-label">Contacto</p>
                        <p>
                            <a :href="contact.phoneHref">{{ contact.phone }}</a>
                        </p>
                        <p>
                            <a :href="contact.whatsapp" target="_blank" rel="noopener">WhatsApp</a>
                        </p>
                        <p>
                            <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
                        </p>
                    </div>
                    <nav aria-label="Pie">
                        <p class="k-foot-label">Web</p>
                        <p v-for="item in nav" :key="item.to">
                            <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
                        </p>
                        <p>
                            <NuxtLink :to="`${base}/contacto`">Contacto</NuxtLink>
                        </p>
                    </nav>
                </div>
                <div class="k-foot-legal">
                    <p>© {{ year }} Marina Roustan</p>
                    <a href="#">Aviso legal</a>
                    <a href="#">Privacidad</a>
                    <p>{{ proposal.cookies }}</p>
                </div>
            </div>
        </footer>
        <Lab2Bar :page />
    </div>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes -->

<script setup lang="ts">
import Lab2Bar from "../Lab2Bar.vue";
import { contact, type LabPage, mapsUrl, navFor, proposal, useLabBase } from "../content";

interface Props {
    page: LabPage;
}

defineProps<Props>();

const base = useLabBase();
const nav = navFor(base);
const year = new Date().getFullYear();
const route = useRoute();
watch(
    () => route.fullPath,
    () => document.querySelector<HTMLDetailsElement>(".k-menu")?.removeAttribute("open"),
);

useHead({
    link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Young+Serif&display=swap",
        },
    ],
});
</script>

<style>
.consulta {
    --paper: #fff;
    --sand: #f5f1e8;
    --sun: #f4c95d;
    --ink: #1d2943;
    --muted: #4a5469;
    --line: #e1dccf;
    --f-ink: var(--ink);
    --f-muted: var(--muted);
    --f-line: #c9c3b4;
    --f-accent: var(--ink);
    --f-accent-ink: #fff;
    --f-radius: 8px;
    --f-field: #fff;
    --f-label-weight: 600;
    min-height: 100vh;
    background: var(--paper);
    color: var(--ink);
    font-family: "Hanken Grotesk", system-ui, sans-serif;
    font-size: 1.125rem;
    line-height: 1.6;
}
/* Marina's live palette, from layers/design main.css. */
.consulta.marina {
    --paper: #fff;
    --sand: #def1fc;
    --sun: #def1fc;
    --mark: #b6671e;
    --ink: #375b6f;
    --muted: #4b5459;
    --line: #c7d7e0;
    --cta: #7e3f00;
    --cta-hover: #623100;
    --f-line: #89a6b6;
    --f-accent: #7e3f00;
}
.consulta.marina ::selection {
    background: #acdcf8;
}
.consulta ::selection {
    background: var(--sun);
}
.consulta a {
    color: var(--ink);
    text-underline-offset: 0.2em;
}
.consulta :focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 3px;
}
.k-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding-inline: 1.25rem;
}
@media (min-width: 900px) {
    .k-wrap {
        padding-inline: 2.5rem;
    }
}
.k-serif,
.consulta h1,
.consulta h2 {
    font-family: "Young Serif", Georgia, serif;
    font-weight: 400;
    letter-spacing: -0.01em;
}
.k-head-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem 2rem;
    padding-block: 1.1rem;
}
.consulta .k-mark {
    font-family: "Young Serif", Georgia, serif;
    font-size: 1.5rem;
    text-decoration: none;
}
.k-nav {
    display: none;
    gap: 2.25rem;
    margin-left: auto;
    margin-right: 1rem;
}
.consulta .k-nav a {
    text-decoration: none;
}
.consulta .k-nav a:hover,
.consulta .k-nav a.router-link-active {
    text-decoration: underline;
    text-decoration-thickness: 2px;
}
.k-head {
    position: relative;
}
.k-menu summary {
    cursor: pointer;
    list-style: none;
    font-weight: 600;
    padding: 0.7rem 0.25rem;
}
.k-menu summary::-webkit-details-marker {
    display: none;
}
.k-menu nav {
    position: absolute;
    inset-inline: 0;
    top: 100%;
    z-index: 20;
    display: grid;
    padding: 0.5rem 1.25rem 1.25rem;
    background: var(--paper);
    border-bottom: 1px solid var(--line);
}
.consulta .k-menu nav a {
    padding-block: 0.8rem;
    border-top: 1px solid var(--line);
    text-decoration: none;
    font-size: 1.1875rem;
}
@media (min-width: 760px) {
    .k-nav {
        display: flex;
    }
    .k-menu {
        display: none;
    }
}
.k-head-actions {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}
.consulta .k-button {
    display: inline-block;
    padding: 0.7rem 1.35rem;
    border-radius: 8px;
    background: var(--cta, var(--ink));
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    line-height: 1.3;
}
.consulta .k-button:hover {
    background: var(--cta-hover, #2c3b5e);
}
.consulta .k-button.outline {
    background: transparent;
    color: var(--ink);
    box-shadow: inset 0 0 0 1.5px var(--ink);
}
.consulta .k-button.outline:hover {
    background: rgb(29 41 67 / 0.06);
}
.k-foot {
    background: var(--ink);
    color: #e4e9f0;
    padding-block: 5rem 2rem;
    font-size: 1rem;
    line-height: 1.7;
}
.consulta .k-foot a {
    color: #fff;
    text-decoration: none;
}
.consulta .k-foot a:hover {
    text-decoration: underline;
}
.k-foot-grid {
    display: grid;
    gap: 2.5rem;
}
@media (min-width: 640px) {
    .k-foot-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    .k-foot-brand {
        grid-column: 1 / -1;
    }
}
@media (min-width: 1000px) {
    .k-foot-grid {
        grid-template-columns: 1.6fr repeat(3, 1fr);
        gap: 3rem;
    }
    .k-foot-brand {
        grid-column: auto;
    }
}
.k-foot-name {
    font-family: "Young Serif", Georgia, serif;
    color: #fff;
    font-size: 1.75rem;
    line-height: 1.2;
    margin-bottom: 0.5rem;
}
.k-foot-creds {
    margin-top: 0.25rem;
    font-size: 0.9375rem;
}
.consulta .k-foot .k-foot-cta {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.65rem 1.35rem;
    border-radius: 8px;
    background: #fff;
    color: var(--ink);
    font-weight: 600;
}
.consulta .k-foot .k-foot-cta:hover {
    text-decoration: none;
    background: #eef3f7;
}
.k-foot-label {
    margin-bottom: 0.75rem;
    color: #fff;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}
.k-foot-legal {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 2rem;
    margin-top: 4rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgb(255 255 255 / 0.2);
    font-size: 0.9375rem;
}
.k-h2 {
    font-size: clamp(1.875rem, 3.5vw, 2.625rem);
    line-height: 1.15;
    margin-bottom: 1rem;
}
.k-block {
    padding-block: 4.5rem;
}
@media (min-width: 900px) {
    .k-block {
        padding-block: 6rem;
    }
}
.sand {
    background: var(--sand);
}
.consulta .more {
    display: inline-block;
    margin-top: 0.6rem;
    font-weight: 600;
    text-decoration: none;
}
.consulta .more:hover {
    text-decoration: underline;
}
</style>
