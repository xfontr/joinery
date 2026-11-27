<!-- eslint-disable better-tailwindcss/no-unknown-classes -- throwaway lab -->
<template>
    <div class="k-wrap k-block split">
        <div>
            <component :is="level" class="split-title">{{ title }}</component>
            <p class="lead">{{ lead }}</p>
            <dl class="ways">
                <div>
                    <dt>Teléfono</dt>
                    <dd>
                        <a :href="contact.phoneHref">{{ contact.phone }}</a>
                    </dd>
                </div>
                <div>
                    <dt>WhatsApp</dt>
                    <dd>
                        <a :href="contact.whatsapp" target="_blank" rel="noopener"
                            >Escribir por WhatsApp</a
                        >
                    </dd>
                </div>
                <div>
                    <dt>Email</dt>
                    <dd>
                        <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
                    </dd>
                </div>
                <div>
                    <dt>Consulta</dt>
                    <dd>
                        {{ contact.address }}, {{ contact.city }} ·
                        <a :href="mapsUrl" target="_blank" rel="noopener">Cómo llegar</a>
                    </dd>
                </div>
            </dl>
        </div>
        <div class="panel">
            <p class="panel-title">Mándame un mensaje</p>
            <Lab2Form />
        </div>
    </div>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes -->

<script setup lang="ts">
import { contact, mapsUrl } from "../content";
import Lab2Form from "../Lab2Form.vue";

interface Props {
    level: "h1" | "h2";
    title: string;
    lead: string;
}

defineProps<Props>();
</script>

<style scoped>
.split {
    display: grid;
    gap: 3rem;
}
@media (min-width: 900px) {
    .split {
        grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
        gap: 4.5rem;
        align-items: start;
    }
}
.split-title {
    font-family: "Young Serif", Georgia, serif;
    font-size: clamp(2.375rem, 5vw, 3.5rem);
    line-height: 1.08;
}
.lead {
    margin-top: 1rem;
    font-size: 1.25rem;
    max-width: 30rem;
}
.ways {
    margin-top: 2.25rem;
    display: flex;
    flex-direction: column;
}
.ways div {
    padding-block: 0.9rem;
    border-top: 1px solid var(--line);
}
.ways dt {
    font-size: 0.9375rem;
    color: var(--muted);
}
.ways dd {
    font-weight: 600;
    overflow-wrap: anywhere;
}
.panel {
    background: var(--panel-bg, var(--sand));
    border-radius: 12px;
    padding: 1.5rem;
}
@media (min-width: 900px) {
    .panel {
        padding: 2.5rem;
    }
}
.panel-title {
    font-family: "Young Serif", Georgia, serif;
    font-size: 1.625rem;
    line-height: 1.2;
    margin-bottom: 1.25rem;
}
</style>
