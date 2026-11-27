<!-- eslint-disable better-tailwindcss/no-unknown-classes, vue/max-lines-per-block -- throwaway lab -->
<template>
    <ConsultaShell page="inicio">
        <section class="hero">
            <div class="k-wrap hero-grid">
                <div class="hero-text">
                    <h1>Hablar con alguien ayuda. Empecemos por ahí.</h1>
                    <p class="hero-lead">
                        Soy Marina Roustan, psicóloga clínica. Te atiendo en mi consulta del
                        Eixample, en terapia individual, de pareja o de grupo.
                    </p>
                    <div class="hero-actions">
                        <NuxtLink to="#contacto" class="k-button">Pide cita</NuxtLink>
                        <a
                            :href="contact.whatsapp"
                            class="k-button outline"
                            target="_blank"
                            rel="noopener"
                            >Escríbeme por WhatsApp</a
                        >
                    </div>
                    <p class="hero-proof">
                        Especialista en Psicología Clínica · Colegiada 7538 · Consulta propia desde
                        1994
                    </p>
                </div>
                <svg
                    class="arch"
                    viewBox="0 0 400 460"
                    aria-hidden="true"
                    fill="none"
                    stroke="var(--ink)"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path
                        d="M0 460V180A200 180 0 0 1 400 180V460Z"
                        fill="var(--sand)"
                        stroke="none"
                    />
                    <circle cx="200" cy="175" r="58" fill="var(--sun)" stroke="none" />
                    <path d="M40 420H360" />
                    <g id="k-chair">
                        <rect
                            x="66"
                            y="252"
                            width="30"
                            height="116"
                            rx="15"
                            fill="#fff"
                            transform="rotate(-9 81 368)"
                        />
                        <rect x="78" y="336" width="88" height="30" rx="12" fill="#fff" />
                        <path d="M96 318H150Q160 318 160 328V336" />
                        <path d="M90 366L82 420M156 366L164 420" />
                    </g>
                    <use href="#k-chair" transform="translate(400 0) scale(-1 1)" />
                    <path d="M176 366H224M200 366V420M186 420H214" />
                    <path d="M190 366L187 344H213L210 366Z" fill="var(--ink)" />
                    <path
                        d="M200 344C200 318 196 300 186 286M200 344C202 316 210 298 222 290M200 344C198 326 204 312 200 300"
                    />
                    <path
                        d="M186 286C176 284 172 292 176 298C184 300 188 294 186 286ZM222 290C232 286 236 294 230 300C222 302 220 296 222 290ZM200 300C194 294 196 286 200 282C204 286 206 294 200 300Z"
                        fill="var(--ink)"
                    />
                </svg>
            </div>
        </section>

        <TherapiesBlock />

        <section id="sobre-mi" class="about-band">
            <div class="k-wrap about">
                <figure class="portrait">
                    <img :src="portrait" alt="Marina Roustan" width="319" height="546" />
                </figure>
                <div class="about-text">
                    <h2 class="k-h2">Sobre mí</h2>
                    <p class="creds">
                        Psicóloga clínica especialista · Colegiada 7538 COPC · Doctora por la UAB
                    </p>
                    <p v-for="line in intro.body" :key="line">{{ line }}</p>
                    <NuxtLink to="/lab2/c/sobre-mi" class="more"
                        >Formación y trayectoria <span aria-hidden="true">→</span></NuxtLink
                    >
                </div>
            </div>
        </section>

        <CancerBlock />

        <section id="opiniones">
            <div class="k-wrap k-block">
                <h2 class="k-h2">Lo que dicen quienes ya han venido</h2>
                <div class="voices">
                    <figure v-for="item in voices" :key="item.name" :lang="item.lang">
                        <p class="voice-head">“{{ voiceHeads[item.name] }}”</p>
                        <blockquote>{{ item.text }}</blockquote>
                        <figcaption>{{ item.name }}</figcaption>
                    </figure>
                </div>
            </div>
        </section>

        <section id="consulta" class="sand">
            <div class="k-wrap k-block place">
                <div class="place-photo" role="img" aria-label="Foto de la consulta, pendiente">
                    <span>Foto de la consulta<br />(pendiente: la pide Marina)</span>
                </div>
                <div>
                    <h2 class="k-h2">La consulta</h2>
                    <p>Te atiendo en un piso del Eixample, en la calle Comte d'Urgell.</p>
                    <dl class="place-facts">
                        <dt>Dirección</dt>
                        <dd>{{ contact.address }}, {{ contact.city }}</dd>
                        <dt>Teléfono</dt>
                        <dd>
                            <a :href="contact.phoneHref">{{ contact.phone }}</a>
                        </dd>
                    </dl>
                    <a :href="mapsUrl" class="k-button outline" target="_blank" rel="noopener"
                        >Cómo llegar</a
                    >
                </div>
            </div>
        </section>

        <section>
            <div class="k-wrap k-block">
                <div class="blog-head">
                    <h2 class="k-h2">Del blog</h2>
                    <NuxtLink to="/lab2/c/blog" class="more"
                        >Todos los artículos <span aria-hidden="true">→</span></NuxtLink
                    >
                </div>
                <PostList :items="latest" />
            </div>
        </section>

        <section id="contacto">
            <ContactSplit
                level="h2"
                title="¿Hablamos?"
                lead="Escríbeme una frase o llámame. Te contesto yo y buscamos una hora."
            />
        </section>
    </ConsultaShell>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes, vue/max-lines-per-block -->

<script setup lang="ts">
import ConsultaShell from "~/lab2/c/ConsultaShell.vue";
import CancerBlock from "~/lab2/c/CancerBlock.vue";
import ContactSplit from "~/lab2/c/ContactSplit.vue";
import PostList from "~/lab2/c/PostList.vue";
import TherapiesBlock from "~/lab2/c/TherapiesBlock.vue";
import { contact, intro, mapsUrl, portrait, posts, voiceHeads, voices } from "~/lab2/content";

const latest = posts.slice(0, 3);

useHead({ title: "C · Consulta · Lab 2" });
</script>

<style scoped>
.hero {
    background: var(--sun);
    overflow: hidden;
}
.hero-grid {
    display: grid;
    gap: 2.5rem;
    padding-top: 2.5rem;
}
@media (min-width: 900px) {
    .hero-grid {
        grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
        gap: 3rem;
        padding-top: 4rem;
        min-height: 34rem;
    }
}
.hero-text {
    align-self: center;
}
@media (min-width: 900px) {
    .hero-text {
        padding-bottom: 4.5rem;
    }
}
h1 {
    font-size: clamp(2.375rem, 5.2vw, 3.875rem);
    line-height: 1.08;
    max-width: 16ch;
}
.hero-lead {
    margin-top: 1.25rem;
    font-size: 1.25rem;
    max-width: 34rem;
}
.hero-actions {
    margin-top: 1.75rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}
.hero-proof {
    margin-top: 1.5rem;
    font-size: 0.9875rem;
    color: #3b4253;
}

/* The arch rises from the band's bottom edge. */
.arch {
    display: block;
    align-self: end;
    justify-self: center;
    width: min(100%, 25rem);
    height: auto;
}
.about-band {
    background: var(--sun);
}
.about {
    display: grid;
    gap: 2.5rem;
    padding-top: 4.5rem;
}
@media (min-width: 900px) {
    .about {
        grid-template-columns: 18rem minmax(0, 1fr);
        gap: 4rem;
        padding-top: 6rem;
    }
}
.portrait {
    order: 2;
    align-self: end;
    justify-self: center;
    width: min(100%, 14rem);
}
.portrait img {
    display: block;
    width: 100%;
    height: auto;
}
.about-text p {
    max-width: 44rem;
}
.about-text p + p {
    margin-top: 1em;
}
.about-text {
    padding-bottom: 1rem;
}
.creds {
    margin-top: -0.25rem;
    margin-bottom: 1.5rem;
    font-size: 1rem;
    letter-spacing: 0.01em;
    color: #3b4253;
}
@media (min-width: 900px) {
    .portrait {
        order: 0;
    }
    .about-text {
        align-self: center;
        padding-bottom: 4rem;
    }
}
.voices {
    margin-top: 2.25rem;
    display: grid;
    gap: 2.5rem;
}
@media (min-width: 900px) {
    .voices {
        grid-template-columns: repeat(3, 1fr);
        gap: 3rem;
    }
}
.voice-head {
    font-family: "Young Serif", Georgia, serif;
    font-size: 1.5rem;
    line-height: 1.25;
    margin-bottom: 0.9rem;
}
.voices blockquote {
    font-size: 1.0625rem;
    line-height: 1.65;
}
.voices figcaption {
    margin-top: 0.9rem;
    font-weight: 600;
}
.blog-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem 2rem;
    margin-bottom: 2rem;
}
.place {
    display: grid;
    gap: 2.5rem;
    align-items: center;
}
@media (min-width: 900px) {
    .place {
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
    }
}
.place-photo {
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    background: var(--paper);
    border: 1.5px dashed #c9c3b4;
    display: grid;
    place-items: center;
    text-align: center;
    color: var(--muted);
    font-size: 1rem;
}
.place-facts {
    margin-block: 1.5rem;
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.4rem 1.5rem;
}
.place-facts dt {
    font-weight: 600;
}
</style>
