<template>
    <section class="grid gap-4 md:grid-cols-3">
        <header>
            <h2 class="font-semibold">{{ title }}</h2>
            <p class="text-sm text-muted">{{ hint }}</p>
        </header>
        <div class="md:col-span-2"><slot /></div>
    </section>
</template>

<script setup lang="ts">
interface Props {
    title: string;
    hint: string;
}

const { title, hint } = defineProps<Props>();
</script>
