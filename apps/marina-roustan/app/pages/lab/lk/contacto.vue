<template>
    <LabShell direction="lk" page="Contacto" :anchors>
        <ContactSide />
    </LabShell>
</template>

<script setup lang="ts">
import LabShell from "~/lab/LabShell.vue";
import ContactSide from "~/lab/sections/ContactSide.vue";

const anchors = [
    { label: "En qué ayudo", anchor: "terapias" },
    { label: "Sobre mí", anchor: "sobre-mi" },
    { label: "Opiniones", anchor: "opiniones" },
];
</script>
