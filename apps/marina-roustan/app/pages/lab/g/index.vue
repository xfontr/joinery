<template>
    <LabShell direction="g" page="Inicio">
        <HeroSplit base="/lab/g" />
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
import HeroSplit from "~/lab/sections/HeroSplit.vue";
import FactsBand from "~/lab/sections/FactsBand.vue";
import Hola from "~/lab/sections/Hola.vue";
import TherapiesOpen from "~/lab/sections/TherapiesOpen.vue";
import BookBand from "~/lab/sections/BookBand.vue";
import Voices from "~/lab/sections/Voices.vue";
import Writing from "~/lab/sections/Writing.vue";
import ContactSplit from "~/lab/sections/ContactSplit.vue";
</script>
