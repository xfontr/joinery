<template>
    <section class="border-y border-default bg-muted">
        <ul
            class="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-6 px-5 py-8 text-base md:grid-cols-4 md:px-10"
        >
            <li v-for="item in items" :key="item.label" class="flex flex-col">
                <span data-display class="text-2xl text-highlighted">{{ item.figure }}</span>
                <span class="text-muted">{{ item.label }}</span>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import { contact } from "../fixtures";

const items = [
    { figure: "+25 años", label: "de consulta" },
    { figure: "+200", label: "pacientes" },
    { figure: "Clínica y forense", label: "psicóloga y psicoterapeuta" },
    {
        figure: contact.registry.replace("Centro Sanitario n.º ", ""),
        label: "n.º de centro sanitario",
    },
];
</script>
