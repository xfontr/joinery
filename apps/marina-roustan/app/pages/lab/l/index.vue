<template>
    <LabShell direction="l" page="Inicio" :anchors>
        <HeroSplit base="/lab/l" />
        <FactsBand />
        <ConcernRows base="/lab/l" />
        <Hola base="/lab/l" />
        <CancerBook base="/lab/l" />
        <div class="pt-24 md:pt-32">
            <Writing />
        </div>
        <div class="bg-muted">
            <Voices />
        </div>
        <ContactSide />
        <CallBar base="/lab/l" />
    </LabShell>
</template>

<script setup lang="ts">
import LabShell from "~/lab/LabShell.vue";
import CallBar from "~/lab/sections/CallBar.vue";
import CancerBook from "~/lab/sections/CancerBook.vue";
import ConcernRows from "~/lab/sections/ConcernRows.vue";
import ContactSide from "~/lab/sections/ContactSide.vue";
import FactsBand from "~/lab/sections/FactsBand.vue";
import HeroSplit from "~/lab/sections/HeroSplit.vue";
import Hola from "~/lab/sections/Hola.vue";
import Voices from "~/lab/sections/Voices.vue";
import Writing from "~/lab/sections/Writing.vue";

const anchors = [
    { label: "En qué ayudo", anchor: "terapias" },
    { label: "Sobre mí", anchor: "sobre-mi" },
    { label: "Publicaciones", anchor: "publicaciones" },
];
</script>
