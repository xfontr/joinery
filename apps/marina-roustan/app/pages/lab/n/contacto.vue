<template>
    <LabShell direction="n" page="Contacto" :anchors>
        <ContactN />
    </LabShell>
</template>

<script setup lang="ts">
import LabShell from "~/lab/LabShell.vue";
import ContactN from "~/lab/n/ContactN.vue";

const anchors = [
    { label: "En qué ayudo", anchor: "terapias" },
    { label: "Sobre mí", anchor: "sobre-mi" },
    { label: "Opiniones", anchor: "opiniones" },
];
</script>
