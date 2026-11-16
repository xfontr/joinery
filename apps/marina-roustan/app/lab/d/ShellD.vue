<template>
    <div data-lab="d" class="flex min-h-screen flex-col bg-default text-default">
        <header
            class="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-5 md:px-10"
        >
            <NuxtLink to="/lab/d" class="flex flex-col leading-tight">
                <span class="text-lg font-medium text-highlighted">Marina Roustan</span>
                <span class="text-sm text-muted">Psicóloga clínica</span>
            </NuxtLink>
            <nav class="hidden items-center gap-8 text-base md:flex" aria-label="Principal">
                <NuxtLink
                    v-for="item in nav"
                    :key="item.anchor"
                    :to="`/lab/d#${item.anchor}`"
                    class="hover:text-highlighted"
                >
                    {{ item.label }}
                </NuxtLink>
            </nav>
            <UButton
                to="/lab/d/contacto"
                color="neutral"
                size="lg"
                :label="copy.primary"
                class="rounded-full px-5"
            />
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="bg-inverted text-inverted">
            <div
                class="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 text-sm md:flex-row md:items-end md:justify-between md:px-10"
            >
                <div class="flex flex-col gap-1">
                    <span class="text-lg font-medium">Marina Roustan</span>
                    <span>{{ contact.address }}, {{ contact.city }}</span>
                    <span>{{ contact.registry }}</span>
                </div>
                <div class="flex gap-6">
                    <a :href="contact.phoneHref">{{ contact.phone }}</a>
                    <a :href="`mailto:${contact.email}`">Email</a>
                    <span>Aviso legal</span>
                </div>
            </div>
        </footer>

        <LabNotes direction="d" :page />
    </div>
</template>

<script setup lang="ts">
import LabNotes from "../LabNotes.vue";
import { contact, copy, nav } from "../fixtures";

interface Props {
    page: string;
}

defineProps<Props>();
</script>

<style>
[data-lab="d"] {
    --ui-bg: var(--color-paper-50);
    --ui-bg-muted: var(--color-paper-100);
    --ui-bg-elevated: #fff;
    --ui-bg-accented: var(--color-paper-200);
    --ui-bg-inverted: var(--color-ink-800);
    --ui-text: var(--color-ink-700);
    --ui-text-toned: var(--color-ink-700);
    --ui-text-muted: var(--color-ink-500);
    --ui-text-highlighted: var(--color-ink-800);
    --ui-border: rgb(21 41 52 / 14%);
    --ui-border-accented: var(--color-ink-500);

    font-family: "Inter Tight", Inter, system-ui, sans-serif;
}

[data-lab="d"] :is(h1, h2, h3) {
    font-weight: 500;
    letter-spacing: -0.03em;
}
</style>
