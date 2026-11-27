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
import ConsultaShell from "~/lab2b/c/ConsultaShell.vue";
import ContactSplit from "~/lab2b/c/ContactSplit.vue";

useHead({ title: "B · antes · Contacto · Lab 2" });
</script>
