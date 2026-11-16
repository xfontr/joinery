<template>
    <LabShell direction="h" page="Inicio">
        <HeroCentred base="/lab/h" />
        <FactsBand />
        <Hola />
        <TherapiesRows />
        <BookBand />
        <Voices />
        <Writing />
        <ContactCentred />
    </LabShell>
</template>

<script setup lang="ts">
import LabShell from "~/lab/LabShell.vue";
import HeroCentred from "~/lab/sections/HeroCentred.vue";
import FactsBand from "~/lab/sections/FactsBand.vue";
import Hola from "~/lab/sections/Hola.vue";
import TherapiesRows from "~/lab/sections/TherapiesRows.vue";
import BookBand from "~/lab/sections/BookBand.vue";
import Voices from "~/lab/sections/Voices.vue";
import Writing from "~/lab/sections/Writing.vue";
import ContactCentred from "~/lab/sections/ContactCentred.vue";
</script>
