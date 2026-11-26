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
                <nav class="arch" aria-labelledby="arch-title">
                    <h2 id="arch-title">¿Qué te trae por aquí?</h2>
                    <ul>
                        <li v-for="item in concerns" :key="item.title">
                            <NuxtLink :to="`#tema-${slug(item.title)}`">
                                {{ item.title }}<span aria-hidden="true">→</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="#contacto">
                                Otra cosa, o no lo sé<span aria-hidden="true">→</span>
                            </NuxtLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </section>

        <section id="primera-vez" class="k-wrap k-block">
            <h2 class="k-h2">La primera vez</h2>
            <p class="section-lead">
                Pedir ayuda cuesta. Así es como empezamos, sin compromiso de seguir.
            </p>
            <ol class="steps">
                <li v-for="(step, index) in proposal.steps" :key="step.title">
                    <span class="step-n" aria-hidden="true">{{ index + 1 }}</span>
                    <div>
                        <h3>{{ step.title }}</h3>
                        <p>{{ step.body }}</p>
                    </div>
                </li>
            </ol>
        </section>

        <section id="ayuda" class="sand">
            <div class="k-wrap k-block">
                <h2 class="k-h2">En qué te puedo ayudar</h2>
                <ul class="concerns">
                    <li v-for="item in concerns" :id="`tema-${slug(item.title)}`" :key="item.title">
                        <h3>{{ item.title }}</h3>
                        <p>{{ concernDetail[item.title] }}</p>
                        <NuxtLink
                            :to="{ query: { tema: item.title }, hash: '#contacto' }"
                            class="more"
                            >Cuéntame <span aria-hidden="true">→</span></NuxtLink
                        >
                    </li>
                </ul>
                <div class="ways-row">
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
                            Hago coordinación de parentalidad e informes periciales, y los defiendo
                            en juicio.
                        </p>
                        <NuxtLink :to="{ query: { tema: legalTopic }, hash: '#contacto' }"
                            >Contactar sobre un caso <span aria-hidden="true">→</span></NuxtLink
                        >
                        <NuxtLink to="/lab2/c/trayectoria"
                            >Ver mi trayectoria <span aria-hidden="true">→</span></NuxtLink
                        >
                    </aside>
                </div>
            </div>
        </section>

        <section id="sobre-mi" class="k-wrap k-block about">
            <figure class="portrait">
                <img :src="portrait" alt="Marina Roustan" width="319" height="546" />
            </figure>
            <div>
                <h2 class="k-h2">Sobre mí</h2>
                <p v-for="line in intro.body" :key="line">{{ line }}</p>
                <dl class="creds">
                    <div v-for="item in credentials" :key="item.label">
                        <dt>{{ item.label }}</dt>
                        <dd>{{ item.value }}</dd>
                    </div>
                </dl>
                <NuxtLink to="/lab2/c/trayectoria" class="more"
                    >Formación y trayectoria <span aria-hidden="true">→</span></NuxtLink
                >
            </div>
        </section>

        <section id="cancer" class="sand">
            <div class="k-wrap k-block cancer">
                <div>
                    <h2 class="k-h2">Más de 15 años acompañando a quien vive un cáncer</h2>
                    <p>
                        En consulta individual y en grupos para mujeres con cáncer de mama, con el
                        método GAFA, que creé y publiqué en 2011. Durante el tratamiento y también
                        después, cuando hay que reorganizar la vida.
                    </p>
                    <NuxtLink :to="{ query: { tema: 'Cáncer' }, hash: '#contacto' }" class="more"
                        >Hablar de tu caso <span aria-hidden="true">→</span></NuxtLink
                    >
                </div>
                <figure class="cancer-book">
                    <img
                        :src="book.image"
                        :alt="`Portada de ${book.title}`"
                        width="500"
                        height="800"
                    />
                    <figcaption>
                        Mi libro, <em>{{ book.title }}</em>
                    </figcaption>
                </figure>
            </div>
        </section>

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
import ContactSplit from "~/lab2/c/ContactSplit.vue";
import {
    book,
    concernDetail,
    concerns,
    contact,
    credentials,
    intro,
    legalTopic,
    mapsUrl,
    portrait,
    proposal,
    slug,
    therapies,
    voiceHeads,
    voices,
} from "~/lab2/content";

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

/* The arch rises from the band's bottom edge, as the portrait did. */
.arch {
    align-self: end;
    justify-self: center;
    width: min(100%, 25rem);
    background: #fff;
    border-radius: 50% 50% 0 0 / 7.5rem 7.5rem 0 0;
    padding: 3.5rem 2rem 2rem;
}
.arch h2 {
    font-size: 1.625rem;
    line-height: 1.2;
    text-align: center;
    margin-bottom: 1.25rem;
}
.arch li + li {
    border-top: 1px solid var(--line);
}
.arch a {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding-block: 0.7rem;
    font-weight: 500;
    text-decoration: none;
}
.arch a span {
    transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.arch a:hover span {
    transform: translateX(4px);
}
.arch a:hover {
    text-decoration: underline;
    text-underline-offset: 0.2em;
}

.section-lead {
    max-width: 38rem;
    color: var(--muted);
}
.steps {
    margin-top: 2.5rem;
    display: grid;
    gap: 2rem;
}
@media (min-width: 800px) {
    .steps {
        grid-template-columns: repeat(3, 1fr);
        gap: 3rem;
    }
}
.steps li {
    display: flex;
    gap: 1rem;
}
.step-n {
    flex: none;
    display: grid;
    place-items: center;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 999px;
    background: var(--sun);
    font-family: "Young Serif", Georgia, serif;
    font-size: 1.25rem;
}
.steps h3,
.concerns h3,
.ways h3 {
    font-family: "Young Serif", Georgia, serif;
    font-size: 1.375rem;
    line-height: 1.25;
    margin-bottom: 0.35rem;
}
.steps p {
    color: var(--muted);
}
.sand {
    background: var(--sand);
}
.concerns {
    margin-top: 2.25rem;
    display: grid;
    gap: 0 2.5rem;
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
    padding-block: 1.4rem 1.6rem;
    border-top: 1.5px solid var(--ink);
    scroll-margin-top: 1.5rem;
}
.concerns li:target {
    background: rgb(244 201 93 / 0.35);
    box-shadow: 0 0 0 0.75rem rgb(244 201 93 / 0.35);
}
.concerns p {
    color: var(--muted);
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
.ways-row {
    margin-top: 3rem;
    display: grid;
    gap: 1.25rem;
}
@media (min-width: 1000px) {
    .ways-row {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
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
.cancer {
    display: grid;
    gap: 2.5rem;
}
@media (min-width: 900px) {
    .cancer {
        grid-template-columns: minmax(0, 38rem) 11rem;
        justify-content: space-between;
        align-items: center;
        gap: 5rem;
    }
}
.cancer .k-h2 {
    max-width: 20ch;
}
.cancer-book {
    width: 9rem;
}
@media (min-width: 900px) {
    .cancer-book {
        width: 100%;
    }
}
.cancer-book img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 3px;
    box-shadow: 0 6px 18px rgb(29 41 67 / 0.18);
}
.cancer-book figcaption {
    margin-top: 0.9rem;
    font-size: 0.9375rem;
    line-height: 1.45;
    color: var(--muted);
}
.ways {
    padding: 1.75rem;
    background: #fff;
    border-radius: 12px;
}
.ways dl {
    margin-top: 1rem;
    display: grid;
    gap: 1rem 2rem;
}
@media (min-width: 800px) {
    .ways dl {
        grid-template-columns: repeat(4, 1fr);
    }
}
.ways dt {
    font-weight: 600;
}
.ways dd {
    color: var(--muted);
    font-size: 1rem;
}
.about {
    display: grid;
    gap: 2.5rem;
}
@media (min-width: 900px) {
    .about {
        grid-template-columns: 22rem minmax(0, 1fr);
        gap: 5rem;
        align-items: start;
    }
}
.portrait {
    background: var(--sand);
    border-radius: 50% 50% 0 0 / 9rem 9rem 0 0;
    padding: 2rem 2rem 0;
    width: min(100%, 22rem);
}
.portrait img {
    display: block;
    width: 78%;
    height: auto;
    margin: 0 auto;
    mix-blend-mode: multiply;
}
.about p + p {
    margin-top: 1em;
}
.creds {
    margin-block: 1.75rem 0.5rem;
    display: grid;
    gap: 0;
}
.creds div {
    display: grid;
    grid-template-columns: 9.5rem 1fr;
    gap: 1rem;
    padding-block: 0.6rem;
    border-top: 1px solid var(--line);
    font-size: 1rem;
}
.creds dt {
    font-weight: 600;
}
.creds dd {
    color: var(--muted);
}
@media (max-width: 520px) {
    .creds div {
        grid-template-columns: 1fr;
        gap: 0;
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
