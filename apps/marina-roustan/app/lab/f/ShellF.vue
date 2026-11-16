<template>
    <div data-lab="f" class="flex min-h-screen flex-col bg-default text-default">
        <header data-dark>
            <div
                class="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 md:px-10"
            >
                <NuxtLink to="/lab/f" class="flex flex-col leading-tight">
                    <span class="text-lg font-semibold text-highlighted">Marina Roustan</span>
                    <span class="text-sm text-muted">Psicóloga clínica</span>
                </NuxtLink>
                <nav class="hidden items-center gap-8 text-base md:flex" aria-label="Principal">
                    <NuxtLink
                        v-for="item in nav"
                        :key="item.anchor"
                        :to="`/lab/f#${item.anchor}`"
                        class="hover:text-highlighted"
                    >
                        {{ item.label }}
                    </NuxtLink>
                </nav>
                <UButton
                    to="/lab/f/contacto"
                    color="neutral"
                    size="lg"
                    :label="copy.primary"
                    class="rounded-full px-5"
                />
            </div>
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="border-t border-default">
            <div
                class="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 text-sm md:flex-row md:justify-between md:px-10"
            >
                <span class="font-semibold text-highlighted">Marina Roustan</span>
                <span>{{ contact.address }}, {{ contact.city }}</span>
                <span>{{ contact.registry }}</span>
                <span>Aviso legal</span>
            </div>
        </footer>

        <LabNotes direction="f" :page />
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
[data-lab="f"] {
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

    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
}

[data-lab="f"] :is(h1, h2, h3) {
    font-weight: 600;
    letter-spacing: -0.03em;
}

/* Navy surfaces flip the roles, so the same classes and the neutral button read on them */
[data-lab="f"] [data-dark] {
    --ui-text: var(--color-ink-200);
    --ui-text-muted: var(--color-ink-300);
    --ui-text-highlighted: #fff;
    --ui-border: rgb(255 255 255 / 16%);
    --ui-bg-inverted: var(--color-paper-50);
    --ui-text-inverted: var(--color-ink-800);

    color: var(--ui-text);
    background-color: var(--color-ink-800);
}
</style>
