<template>
    <LabShell direction="i" page="Inicio" dark>
        <HeroNavy base="/lab/i" />
        <FactsBand />
        <Hola />
        <TherapiesOpen />
        <BookBand />
        <Voices />
        <Writing />
        <ContactSplit />
    </LabShell>
</template>

<script setup lang="ts">
import LabShell from "~/lab/LabShell.vue";
import HeroNavy from "~/lab/sections/HeroNavy.vue";
import FactsBand from "~/lab/sections/FactsBand.vue";
import Hola from "~/lab/sections/Hola.vue";
import TherapiesOpen from "~/lab/sections/TherapiesOpen.vue";
import BookBand from "~/lab/sections/BookBand.vue";
import Voices from "~/lab/sections/Voices.vue";
import Writing from "~/lab/sections/Writing.vue";
import ContactSplit from "~/lab/sections/ContactSplit.vue";
</script>
