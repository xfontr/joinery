<template>
    <LabShell direction="j" page="Inicio" :anchors>
        <div class="relative isolate overflow-hidden">
            <LabBackdrop :variant="fondo" />
            <HeroCompact base="/lab/j" />
        </div>
        <Concerns base="/lab/j" after-hero />
        <HolaBand base="/lab/j" />
        <CancerBook base="/lab/j" />
        <div class="pt-24 md:pt-32">
            <Writing />
        </div>
        <div class="relative isolate overflow-hidden bg-muted">
            <LabBackdrop :variant="fondo" />
            <Voices />
        </div>
        <ContactWarm />
        <CallBar base="/lab/j" />
        <LabBackdropPicker />
    </LabShell>
</template>

<script setup lang="ts">
import LabBackdrop from "~/lab/LabBackdrop.vue";
import LabBackdropPicker from "~/lab/LabBackdropPicker.vue";
import LabShell from "~/lab/LabShell.vue";
import { useBackdropVariant } from "~/lab/backdrop";
import HeroCompact from "~/lab/sections/HeroCompact.vue";
import Concerns from "~/lab/sections/Concerns.vue";
import HolaBand from "~/lab/sections/HolaBand.vue";
import CancerBook from "~/lab/sections/CancerBook.vue";
import Writing from "~/lab/sections/Writing.vue";
import Voices from "~/lab/sections/Voices.vue";
import ContactWarm from "~/lab/sections/ContactWarm.vue";
import CallBar from "~/lab/sections/CallBar.vue";

const fondo = useBackdropVariant();

const anchors = [
    { label: "En qué ayudo", anchor: "terapias" },
    { label: "Sobre mí", anchor: "sobre-mi" },
    { label: "Publicaciones", anchor: "publicaciones" },
    { label: "Opiniones", anchor: "opiniones" },
];
</script>
