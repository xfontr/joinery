<!-- eslint-disable better-tailwindcss/no-unknown-classes -- throwaway lab -->
<template>
    <div class="consulta-b">
        <header class="kb-head">
            <div class="kb-wrap kb-head-row">
                <NuxtLink to="/lab2/b" class="kb-mark">Marina Roustan</NuxtLink>
                <nav class="kb-nav" aria-label="Principal">
                    <NuxtLink to="/lab2/b#primera-vez">La primera vez</NuxtLink>
                    <NuxtLink to="/lab2/b#ayuda">En qué ayudo</NuxtLink>
                    <NuxtLink to="/lab2/b#sobre-mi">Sobre mí</NuxtLink>
                    <NuxtLink to="/lab2/b#consulta">La consulta</NuxtLink>
                    <NuxtLink to="/lab2/b#opiniones">Opiniones</NuxtLink>
                </nav>
                <div class="kb-head-actions">
                    <a :href="contact.phoneHref" class="kb-phone">{{ contact.phone }}</a>
                    <NuxtLink to="/lab2/b/contacto" class="kb-button">Pide cita</NuxtLink>
                </div>
            </div>
        </header>

        <main>
            <slot />
        </main>

        <footer class="kb-foot">
            <div class="kb-wrap">
                <div class="kb-foot-grid">
                    <div>
                        <p class="kb-foot-name">Marina Roustan</p>
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
                            <NuxtLink to="/lab2/b/trayectoria">Formación y trayectoria</NuxtLink>
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
.consulta-b {
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
.consulta-b ::selection {
    background: var(--sun);
}
.consulta-b a {
    color: var(--ink);
    text-underline-offset: 0.2em;
}
.consulta-b :focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 3px;
}
.kb-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding-inline: 1.25rem;
}
@media (min-width: 900px) {
    .kb-wrap {
        padding-inline: 2.5rem;
    }
}
.kb-serif,
.consulta-b h1,
.consulta-b h2 {
    font-family: "Young Serif", Georgia, serif;
    font-weight: 400;
    letter-spacing: -0.01em;
}
.kb-head-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem 2rem;
    padding-block: 1.1rem;
}
.consulta-b .kb-mark {
    font-family: "Young Serif", Georgia, serif;
    font-size: 1.5rem;
    text-decoration: none;
}
.kb-nav {
    display: none;
    gap: 1.75rem;
    font-size: 1.0625rem;
}
.consulta-b .kb-nav a {
    text-decoration: none;
}
.consulta-b .kb-nav a:hover {
    text-decoration: underline;
}
@media (min-width: 1000px) {
    .kb-nav {
        display: flex;
    }
}
.kb-head-actions {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}
.consulta-b .kb-phone {
    font-weight: 600;
    text-decoration: none;
}
@media (max-width: 560px) {
    .kb-phone {
        display: none;
    }
}
.consulta-b .kb-button {
    display: inline-block;
    padding: 0.7rem 1.35rem;
    border-radius: 8px;
    background: var(--ink);
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    line-height: 1.3;
}
.consulta-b .kb-button:hover {
    background: #2c3b5e;
}
.consulta-b .kb-button.outline {
    background: transparent;
    color: var(--ink);
    box-shadow: inset 0 0 0 1.5px var(--ink);
}
.consulta-b .kb-button.outline:hover {
    background: rgb(29 41 67 / 0.06);
}
.kb-foot {
    background: var(--ink);
    color: #d5dae6;
    padding-block: 3.5rem 5rem;
    font-size: 1rem;
}
.consulta-b .kb-foot a {
    color: #fff;
}
.kb-foot-grid {
    display: grid;
    gap: 1.5rem;
}
@media (min-width: 800px) {
    .kb-foot-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
.kb-foot-name {
    font-family: "Young Serif", Georgia, serif;
    color: #fff;
    font-size: 1.25rem;
}
.kb-h2 {
    font-size: clamp(1.875rem, 3.5vw, 2.625rem);
    line-height: 1.15;
    margin-bottom: 1rem;
}
.kb-block {
    padding-block: 4.5rem;
}
@media (min-width: 900px) {
    .kb-block {
        padding-block: 6rem;
    }
}
</style>
