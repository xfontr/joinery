<!-- eslint-disable better-tailwindcss/no-unknown-classes -- throwaway lab -->
<template>
    <ConsultaShell page="contacto">
        <section class="k-wrap k-block split">
            <div>
                <h1>Pide cita</h1>
                <p class="lead">
                    Escríbeme o llámame. Con una frase basta; te contesto yo y buscamos una hora.
                </p>
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
                <h2 class="panel-title">Mándame un mensaje</h2>
                <p class="urgent" role="note">{{ proposal.urgent }}</p>
                <Lab2Form />
            </div>
        </section>
    </ConsultaShell>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes -->

<script setup lang="ts">
import ConsultaShell from "~/lab2/c/ConsultaShell.vue";
import { contact, mapsUrl, proposal } from "~/lab2/content";
import Lab2Form from "~/lab2/Lab2Form.vue";

useHead({ title: "C · Consulta · Contacto · Lab 2" });
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
h1 {
    font-size: clamp(2.5rem, 5vw, 3.75rem);
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
}
.panel {
    background: var(--sand);
    border-radius: 12px;
    padding: 1.5rem;
}
@media (min-width: 900px) {
    .panel {
        padding: 2.5rem;
    }
}
.urgent {
    margin-bottom: 1.75rem;
    padding: 0.9rem 1.1rem;
    border-radius: 8px;
    background: #fff;
    font-size: 0.9875rem;
    color: var(--muted);
}
.panel-title {
    font-size: 1.625rem;
    margin-bottom: 1.5rem;
}
</style>
