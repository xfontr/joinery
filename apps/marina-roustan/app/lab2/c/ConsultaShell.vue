<!-- eslint-disable better-tailwindcss/no-unknown-classes -- throwaway lab -->
<template>
    <div class="consulta">
        <header class="k-head">
            <div class="k-wrap k-head-row">
                <NuxtLink to="/lab2/c" class="k-mark">Marina Roustan</NuxtLink>
                <nav class="k-nav" aria-label="Principal">
                    <NuxtLink to="/lab2/c#primera-vez">La primera vez</NuxtLink>
                    <NuxtLink to="/lab2/c#ayuda">En qué ayudo</NuxtLink>
                    <NuxtLink to="/lab2/c#sobre-mi">Sobre mí</NuxtLink>
                    <NuxtLink to="/lab2/c#consulta">La consulta</NuxtLink>
                    <NuxtLink to="/lab2/c#opiniones">Opiniones</NuxtLink>
                </nav>
                <div class="k-head-actions">
                    <a :href="contact.phoneHref" class="k-phone">{{ contact.phone }}</a>
                    <NuxtLink to="/lab2/c/contacto" class="k-button">Pide cita</NuxtLink>
                </div>
            </div>
        </header>

        <main>
            <slot />
        </main>

        <footer class="k-foot">
            <div class="k-wrap">
                <div class="k-foot-grid">
                    <div>
                        <p class="k-foot-name">Marina Roustan</p>
                        <p>Psicóloga clínica · Colegiada 7538 COPC</p>
                        <p>{{ contact.registry }}</p>
                    </div>
                    <div>
                        <p>{{ contact.address }}</p>
                        <p>{{ contact.city }}</p>
                    </div>
                    <div>
                        <p>
                            <a :href="contact.phoneHref">{{ contact.phone }}</a>
                        </p>
                        <p>
                            <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
                        </p>
                    </div>
                    <div>
                        <p>
                            <NuxtLink to="/lab2/c/trayectoria">Formación y trayectoria</NuxtLink>
                        </p>
                        <p>{{ proposal.cookies }}</p>
                        <p>Aviso legal</p>
                    </div>
                </div>
            </div>
        </footer>
        <Lab2Bar :page />
    </div>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes -->

<script setup lang="ts">
import Lab2Bar from "../Lab2Bar.vue";
import { contact, proposal } from "../content";

interface Props {
    page: "inicio" | "trayectoria" | "contacto";
}

defineProps<Props>();

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
    gap: 1.75rem;
    font-size: 1.0625rem;
}
.consulta .k-nav a {
    text-decoration: none;
}
.consulta .k-nav a:hover {
    text-decoration: underline;
}
@media (min-width: 1000px) {
    .k-nav {
        display: flex;
    }
}
.k-head-actions {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}
.consulta .k-phone {
    font-weight: 600;
    text-decoration: none;
}
@media (max-width: 560px) {
    .k-phone {
        display: none;
    }
}
.consulta .k-button {
    display: inline-block;
    padding: 0.7rem 1.35rem;
    border-radius: 8px;
    background: var(--ink);
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    line-height: 1.3;
}
.consulta .k-button:hover {
    background: #2c3b5e;
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
    color: #d5dae6;
    padding-block: 3.5rem 5rem;
    font-size: 1rem;
}
.consulta .k-foot a {
    color: #fff;
}
.k-foot-grid {
    display: grid;
    gap: 1.5rem;
}
@media (min-width: 800px) {
    .k-foot-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
.k-foot-name {
    font-family: "Young Serif", Georgia, serif;
    color: #fff;
    font-size: 1.25rem;
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
</style>
