<template>
    <ConsultaShell page="contacto">
        <ContactSplit
            level="h1"
            title="Pide cita"
            lead="Escríbeme o llámame. Con una frase basta; te contesto yo y buscamos una hora."
        />
    </ConsultaShell>
</template>

<script setup lang="ts">
import ConsultaShell from "~/lab2/c/ConsultaShell.vue";
import ContactSplit from "~/lab2/c/ContactSplit.vue";

useHead({ title: "D · Contacto · Lab 2" });
</script>
