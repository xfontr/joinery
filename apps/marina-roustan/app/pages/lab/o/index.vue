<template>
    <LabShell direction="o" page="Inicio" :anchors>
        <div class="flex min-h-[calc(100svh-5rem)] flex-col">
            <HeroO base="/lab/o" />
            <TrustStrip />
        </div>
        <ReasonsOpen base="/lab/o" />
        <HolaBand base="/lab/o" publications />
        <CancerBook base="/lab/o" />
        <div class="pt-24 md:pt-32">
            <Writing />
        </div>
        <div class="bg-muted">
            <Voices />
        </div>
        <ContactN />
        <CallBar base="/lab/o" />
    </LabShell>
</template>

<script setup lang="ts">
import LabShell from "~/lab/LabShell.vue";
import ContactN from "~/lab/n/ContactN.vue";
import ReasonsOpen from "~/lab/n/ReasonsOpen.vue";
import HeroO from "~/lab/o/HeroO.vue";
import CallBar from "~/lab/sections/CallBar.vue";
import CancerBook from "~/lab/sections/CancerBook.vue";
import HolaBand from "~/lab/sections/HolaBand.vue";
import TrustStrip from "~/lab/sections/TrustStrip.vue";
import Voices from "~/lab/sections/Voices.vue";
import Writing from "~/lab/sections/Writing.vue";

const anchors = [
    { label: "En qué ayudo", anchor: "terapias" },
    { label: "Sobre mí", anchor: "sobre-mi" },
    { label: "Publicaciones", anchor: "publicaciones" },
    { label: "Opiniones", anchor: "opiniones" },
];
</script>
