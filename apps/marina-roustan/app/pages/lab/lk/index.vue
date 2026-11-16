<template>
    <LabShell direction="lk" page="Inicio" :anchors>
        <div class="flex min-h-[calc(100svh-5rem)] flex-col">
            <HeroQuote base="/lab/lk" />
            <TrustStrip />
        </div>
        <ConcernRows base="/lab/lk" />
        <Hola base="/lab/lk" />
        <CancerBook base="/lab/lk" />
        <Voices without="Joan Llibre" />
        <ContactSide />
        <CallBar base="/lab/lk" />
    </LabShell>
</template>

<script setup lang="ts">
import LabShell from "~/lab/LabShell.vue";
import CallBar from "~/lab/sections/CallBar.vue";
import CancerBook from "~/lab/sections/CancerBook.vue";
import ConcernRows from "~/lab/sections/ConcernRows.vue";
import ContactSide from "~/lab/sections/ContactSide.vue";
import HeroQuote from "~/lab/sections/HeroQuote.vue";
import Hola from "~/lab/sections/Hola.vue";
import TrustStrip from "~/lab/sections/TrustStrip.vue";
import Voices from "~/lab/sections/Voices.vue";

const anchors = [
    { label: "En qué ayudo", anchor: "terapias" },
    { label: "Sobre mí", anchor: "sobre-mi" },
    { label: "Opiniones", anchor: "opiniones" },
];
</script>
