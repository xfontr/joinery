<!-- eslint-disable better-tailwindcss/no-unknown-classes -- throwaway lab -->
<template>
    <ConsultaShell page="terapias">
        <section class="top">
            <div class="k-wrap">
                <h1>Terapias</h1>
                <p class="lead">
                    Individual, de pareja o de grupo, en la consulta del Eixample. Si no sabes qué
                    necesitas, escríbeme y lo vemos juntos.
                </p>
            </div>
        </section>
        <TherapiesBlock :sand="false" full />
        <CancerBlock />
        <section id="contacto">
            <ContactSplit
                level="h2"
                title="¿Hablamos?"
                lead="Escríbeme una frase o llámame. Te contesto yo y buscamos una hora."
            />
        </section>
    </ConsultaShell>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes -->

<script setup lang="ts">
import CancerBlock from "~/lab2/c/CancerBlock.vue";
import ConsultaShell from "~/lab2/c/ConsultaShell.vue";
import ContactSplit from "~/lab2/c/ContactSplit.vue";
import TherapiesBlock from "~/lab2/c/TherapiesBlock.vue";

useHead({ title: "C · Consulta · Terapias · Lab 2" });
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
h1 {
    font-size: clamp(2.375rem, 5vw, 3.5rem);
    line-height: 1.08;
}
.lead {
    margin-top: 1rem;
    max-width: 36rem;
    font-size: 1.1875rem;
}
</style>
