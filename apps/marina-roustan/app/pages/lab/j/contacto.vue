<template>
    <LabShell direction="j" page="Contacto">
        <ContactWarm />
        <CallBar base="/lab/j" />
    </LabShell>
</template>

<script setup lang="ts">
import LabShell from "~/lab/LabShell.vue";
import ContactWarm from "~/lab/sections/ContactWarm.vue";
import CallBar from "~/lab/sections/CallBar.vue";
</script>
