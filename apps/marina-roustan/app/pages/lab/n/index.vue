<template>
    <LabShell direction="n" page="Inicio" :anchors>
        <div class="flex min-h-[calc(100svh-5rem)] flex-col">
            <HeroN base="/lab/n" />
            <TrustStrip />
        </div>
        <ReasonsOpen base="/lab/n" />
        <Hola base="/lab/n" />
        <CancerBook base="/lab/n" />
        <Voices without="Joan Llibre" />
        <ContactN />
        <CallBar base="/lab/n" />
    </LabShell>
</template>

<script setup lang="ts">
import LabShell from "~/lab/LabShell.vue";
import ContactN from "~/lab/n/ContactN.vue";
import HeroN from "~/lab/n/HeroN.vue";
import ReasonsOpen from "~/lab/n/ReasonsOpen.vue";
import CallBar from "~/lab/sections/CallBar.vue";
import CancerBook from "~/lab/sections/CancerBook.vue";
import Hola from "~/lab/sections/Hola.vue";
import TrustStrip from "~/lab/sections/TrustStrip.vue";
import Voices from "~/lab/sections/Voices.vue";

const anchors = [
    { label: "En qué ayudo", anchor: "terapias" },
    { label: "Sobre mí", anchor: "sobre-mi" },
    { label: "Opiniones", anchor: "opiniones" },
];
</script>
