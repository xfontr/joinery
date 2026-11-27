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
                        fill="var(--paper)"
                        stroke="none"
                    />
                    <circle cx="200" cy="175" r="58" fill="var(--mark)" stroke="none" />
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

        <section id="ayuda" class="d-block">
            <div class="k-wrap">
                <h2 class="d-h2">En qué te puedo ayudar</h2>
                <ul class="areas">
                    <li
                        v-for="(item, index) in areas"
                        :key="item.title"
                        data-reveal
                        :style="{ '--i': index % 3 }"
                    >
                        <h3 class="area-title">{{ item.title }}</h3>
                        <p>{{ item.body }}</p>
                    </li>
                </ul>
            </div>
        </section>

        <section id="sobre-mi" class="hola sand">
            <div class="k-wrap hola-grid">
                <img
                    :src="portrait"
                    alt="Marina Roustan"
                    width="319"
                    height="546"
                    class="hola-pic"
                />
                <div class="hola-text">
                    <h2 class="d-h2">Hola, soy Marina</h2>
                    <p class="hola-creds">
                        Psicóloga clínica especialista · Colegiada 7538 COPC · Doctora por la UAB
                    </p>
                    <p v-for="line in intro.body" :key="line" class="d-lead">{{ line }}</p>
                    <NuxtLink to="/lab2/d/sobre-mi" class="more"
                        >Formación y trayectoria <span aria-hidden="true">→</span></NuxtLink
                    >
                </div>
            </div>
        </section>

        <section id="servicios" class="d-block">
            <div class="k-wrap services-wrap">
                <div class="blog-head">
                    <h2 class="d-h2">Servicios</h2>
                    <NuxtLink to="/lab2/d/terapias" class="more"
                        >Más sobre las terapias <span aria-hidden="true">→</span></NuxtLink
                    >
                </div>
                <div class="services">
                    <article v-for="item in services" :key="item.title" class="service">
                        <div class="service-frame" data-reveal>
                            <img :src="item.image" alt="" />
                        </div>
                        <div class="service-text" data-reveal style="--i: 1">
                            <h3 class="service-title">{{ item.title }}</h3>
                            <p class="service-lead">{{ item.lead }}</p>
                            <p class="service-body">{{ item.body }}</p>
                        </div>
                    </article>
                </div>
                <p class="legal">
                    ¿Te deriva un juzgado o un abogado? También hago psicología forense.
                    <NuxtLink to="#contacto">Contactar sobre un caso</NuxtLink>
                </p>
            </div>
        </section>

        <CancerBlock :kicker="false" />

        <section id="opiniones" class="d-block">
            <div class="k-wrap">
                <h2 class="d-h2">Lo que dicen quienes ya han venido</h2>
                <div class="voices">
                    <figure :lang="first.lang" class="voice-first">
                        <p v-if="voiceHeads[first.name]" class="voice-head">
                            “{{ voiceHeads[first.name] }}”
                        </p>
                        <blockquote>{{ first.text }}</blockquote>
                        <figcaption>{{ first.name }}</figcaption>
                    </figure>
                    <div class="voice-others">
                        <figure v-for="item in others" :key="item.name" :lang="item.lang">
                            <blockquote>«{{ item.text }}»</blockquote>
                            <figcaption>{{ item.name }}</figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </section>

        <section class="d-block sand">
            <div class="k-wrap">
                <div class="blog-head">
                    <h2 class="d-h2">Publicaciones</h2>
                    <NuxtLink to="/lab2/d/blog" class="more"
                        >Todas las publicaciones <span aria-hidden="true">→</span></NuxtLink
                    >
                </div>
                <ul class="writing">
                    <li v-for="post in latest" :key="post.slug" :lang="post.lang">
                        <NuxtLink :to="`/lab2/d/blog/${post.slug}`">
                            <span class="writing-year">{{ post.date.slice(0, 4) }}</span>
                            <span class="writing-title">{{ post.title }}</span>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </section>

        <section id="contacto">
            <ContactSplit
                level="h2"
                title="¿Hablamos?"
                lead="Cuéntame qué te trae. Con tu nombre y un teléfono o un email basta."
            />
        </section>

        <div class="callbar-space" aria-hidden="true" />
        <nav aria-label="Contactar" class="callbar" :class="{ shown }">
            <a :href="contact.phoneHref" class="pill">Llamar</a>
            <a :href="contact.whatsapp" class="pill" target="_blank" rel="noopener">WhatsApp</a>
            <NuxtLink to="#contacto" class="pill solid">Escribir</NuxtLink>
        </nav>
    </ConsultaShell>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes, vue/max-lines-per-block -->

<script setup lang="ts">
import CancerBlock from "~/lab2/c/CancerBlock.vue";
import ConsultaShell from "~/lab2/c/ConsultaShell.vue";
import ContactSplit from "~/lab2/c/ContactSplit.vue";
import {
    areas,
    contact,
    intro,
    portrait,
    posts,
    services,
    voiceHeads,
    voices,
} from "~/lab2/content";

const [first, ...others] = voices;
const latest = posts.slice(0, 4);

const shown = ref(false);
const onScroll = () => {
    shown.value = window.scrollY > window.innerHeight * 0.6;
};

let revealer: IntersectionObserver | undefined;
const reveal = () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    revealer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add("in");
                revealer?.unobserve(entry.target);
            }
        },
        { rootMargin: "0px 0px -12% 0px" },
    );
    for (const element of document.querySelectorAll("[data-reveal]")) {
        element.classList.add("pending");
        revealer.observe(element);
    }
};

onMounted(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    reveal();
});
onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
    revealer?.disconnect();
});

useHead({ title: "D · Lab 2" });
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
    color: var(--muted);
}

/* The arch rises from the band's bottom edge. */
.arch {
    display: block;
    align-self: end;
    justify-self: center;
    width: min(100%, 25rem);
    height: auto;
}

.d-block {
    padding-block: 6rem;
}
@media (min-width: 768px) {
    .d-block {
        padding-block: 8rem;
    }
}
.d-h2 {
    font-size: clamp(2rem, 3.6vw, 2.75rem);
    line-height: 1.15;
}
.d-lead {
    max-width: 36rem;
    font-size: 1.1875rem;
}
@media (min-width: 768px) {
    .d-lead {
        font-size: 1.25rem;
    }
}

.services-wrap {
    max-width: 66rem;
}
.services {
    display: flex;
    flex-direction: column;
    gap: 4.5rem;
}
.service {
    display: grid;
    gap: 1.75rem;
    align-items: center;
}
@media (min-width: 900px) {
    .services {
        gap: 6.5rem;
    }
    .service {
        grid-template-columns: minmax(0, 19rem) minmax(0, 1fr);
        gap: 5rem;
    }
    .service:nth-child(even) {
        grid-template-columns: minmax(0, 1fr) minmax(0, 19rem);
    }
    .service:nth-child(even) .service-frame {
        order: 1;
    }
}
.service-frame {
    width: min(100%, 19rem);
    aspect-ratio: 5 / 4;
}
.service-frame img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.service-text {
    max-width: 36rem;
}
.service-title {
    font-family: "Young Serif", Georgia, serif;
    font-size: clamp(1.5rem, 2.4vw, 1.875rem);
    line-height: 1.2;
}
.service-lead {
    margin-top: 1rem;
}
.service-body {
    margin-top: 0.75rem;
    color: var(--muted);
}
.legal {
    margin-top: 5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--line);
    font-size: 1rem;
    color: var(--muted);
}
.consulta .legal a {
    margin-left: 0.25rem;
    font-weight: 600;
}

.areas {
    display: grid;
    gap: 2.75rem 3.5rem;
    margin-top: 3.5rem;
}
@media (min-width: 700px) {
    .areas {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
@media (min-width: 1024px) {
    .areas {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}
.area-title {
    margin-bottom: 0.5rem;
    font-family: "Young Serif", Georgia, serif;
    font-size: 1.375rem;
    line-height: 1.25;
}
.areas p {
    color: var(--muted);
}

.pending {
    opacity: 0;
    transform: translateY(1.5rem);
    transition:
        opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
        transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--i, 0) * 110ms);
}
.pending.in {
    opacity: 1;
    transform: none;
}
#cancer :deep(h2) {
    font-size: clamp(1.875rem, 3.2vw, 2.5rem);
    line-height: 1.15;
    max-width: 20ch;
}
.hola-grid {
    display: grid;
    gap: 3rem;
    padding-top: 6rem;
}
@media (min-width: 768px) {
    .hola-grid {
        grid-template-columns: 2fr 3fr;
        padding-top: 8rem;
    }
}
.hola-pic {
    order: 2;
    display: block;
    align-self: end;
    justify-self: center;
    width: 14rem;
    height: auto;
}
.hola-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.25rem;
}
.hola-creds {
    font-size: 1rem;
    color: var(--muted);
}
@media (min-width: 768px) {
    .hola-pic {
        order: 0;
        width: 17rem;
    }
    .hola-text {
        padding-bottom: 8rem;
    }
}

.voices {
    display: grid;
    gap: 4rem;
    margin-top: 4rem;
}
@media (min-width: 1024px) {
    .voices {
        grid-template-columns: 3fr 2fr;
    }
}
.voice-head {
    font-family: "Young Serif", Georgia, serif;
    font-size: clamp(1.625rem, 2.8vw, 2.125rem);
    line-height: 1.25;
    margin-bottom: 1.5rem;
}
.voice-first blockquote {
    font-size: 1.25rem;
    line-height: 1.65;
    max-width: 38rem;
}
.voice-others blockquote {
    font-size: 1.0625rem;
}
.voices figcaption {
    margin-top: 1.25rem;
    font-size: 1rem;
    color: var(--muted);
}
.voice-others {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
}
.voice-others figure {
    padding-top: 1.5rem;
    border-top: 1px solid var(--line);
}
.voice-others figcaption {
    margin-top: 0.75rem;
}

.blog-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem 2rem;
    margin-bottom: 3rem;
}
.consulta .writing a {
    display: grid;
    gap: 0.25rem 2rem;
    padding-block: 1.25rem;
    border-top: 1px solid var(--line);
    text-decoration: none;
}
.writing li:last-child a {
    border-bottom: 1px solid var(--line);
}
@media (min-width: 768px) {
    .consulta .writing a {
        grid-template-columns: 6rem 1fr;
        align-items: baseline;
    }
}
.writing-year {
    color: var(--muted);
    font-size: 1rem;
}
.writing-title {
    font-family: "Young Serif", Georgia, serif;
    font-size: clamp(1.25rem, 2.2vw, 1.5rem);
    line-height: 1.3;
}
.writing a:hover .writing-title {
    text-decoration: underline;
    text-underline-offset: 0.2em;
}

.consulta .pill {
    display: inline-flex;
    justify-content: center;
    padding: 0.6rem 1.25rem;
    border-radius: 999px;
    box-shadow: inset 0 0 0 1.5px var(--ink);
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
}
.consulta .pill.solid {
    background: var(--ink);
    color: #fff;
}

.callbar-space {
    height: 5rem;
}
.callbar {
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    z-index: 10;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 0.75rem;
    border-top: 1px solid var(--line);
    background: var(--paper);
    transform: translateY(100%);
    transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
}
.callbar.shown {
    transform: none;
}
@media (min-width: 768px) {
    .callbar-space,
    .callbar {
        display: none;
    }
}
</style>
