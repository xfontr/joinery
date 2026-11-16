<template>
    <LabShell direction="k" page="Inicio" :anchors>
        <HeroAside base="/lab/k" />
        <TrustStrip />
        <Hola base="/lab/k" />
        <Concerns base="/lab/k" />
        <CancerBook base="/lab/k" />
        <Voices without="Joan Llibre" />
        <ContactWarm />
        <CallBar base="/lab/k" />
    </LabShell>
</template>

<script setup lang="ts">
import LabShell from "~/lab/LabShell.vue";
import HeroAside from "~/lab/sections/HeroAside.vue";
import TrustStrip from "~/lab/sections/TrustStrip.vue";
import Concerns from "~/lab/sections/Concerns.vue";
import Hola from "~/lab/sections/Hola.vue";
import CancerBook from "~/lab/sections/CancerBook.vue";
import Voices from "~/lab/sections/Voices.vue";
import ContactWarm from "~/lab/sections/ContactWarm.vue";
import CallBar from "~/lab/sections/CallBar.vue";

const anchors = [
    { label: "Sobre mí", anchor: "sobre-mi" },
    { label: "En qué ayudo", anchor: "terapias" },
    { label: "Opiniones", anchor: "opiniones" },
];
</script>
