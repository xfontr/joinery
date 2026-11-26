<!-- eslint-disable better-tailwindcss/no-unknown-classes -- throwaway lab -->
<template>
    <nav v-if="!clean" class="lb" aria-label="Laboratorio">
        <NuxtLink to="/lab2">Lab 2 · C</NuxtLink>
        <span aria-hidden="true">·</span>
        <NuxtLink
            v-for="item in pages"
            :key="item.id"
            :to="item.to"
            :aria-current="item.id === page ? 'page' : undefined"
            >{{ item.label }}</NuxtLink
        >
    </nav>
</template>
<!-- eslint-enable better-tailwindcss/no-unknown-classes -->

<script setup lang="ts">
interface Props {
    page: "inicio" | "trayectoria" | "contacto";
}

defineProps<Props>();

const clean = "clean" in useRoute().query;
const pages = [
    { id: "inicio", label: "Inicio", to: "/lab2/c" },
    { id: "trayectoria", label: "Trayectoria", to: "/lab2/c/trayectoria" },
    { id: "contacto", label: "Contacto", to: "/lab2/c/contacto" },
];
</script>

<style scoped>
.lb {
    position: fixed;
    right: 12px;
    bottom: 12px;
    z-index: 50;
    display: flex;
    gap: 0.6rem;
    align-items: center;
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    background: #111;
    color: #ddd;
    font:
        500 13px/1.2 system-ui,
        sans-serif;
}
.lb a {
    color: #ddd;
    text-decoration: none;
}
.lb a[aria-current="page"] {
    color: #fff;
    text-decoration: underline;
    text-underline-offset: 3px;
}
</style>
