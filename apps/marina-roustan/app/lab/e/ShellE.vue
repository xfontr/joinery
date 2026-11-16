<template>
    <div data-lab="e" class="flex min-h-screen flex-col bg-default text-default">
        <header
            class="mx-auto grid h-24 w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-6 px-5 md:grid-cols-3 md:px-10"
        >
            <nav class="hidden gap-8 text-base md:flex" aria-label="Principal">
                <NuxtLink
                    v-for="item in nav"
                    :key="item.anchor"
                    :to="`/lab/e#${item.anchor}`"
                    class="hover:text-highlighted"
                >
                    {{ item.label }}
                </NuxtLink>
            </nav>
            <NuxtLink
                to="/lab/e"
                data-display
                class="text-2xl text-highlighted md:text-center md:text-3xl"
            >
                Marina Roustan
            </NuxtLink>
            <UButton
                to="/lab/e/contacto"
                color="neutral"
                size="lg"
                :label="copy.primary"
                class="justify-self-end rounded-full px-6"
            />
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="bg-inverted text-inverted">
            <div
                class="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-14 text-center text-sm md:px-10"
            >
                <span data-display class="text-3xl">Marina Roustan</span>
                <span>{{ contact.address }}, {{ contact.city }} · {{ contact.phone }}</span>
                <span>{{ contact.registry }} · Aviso legal</span>
            </div>
        </footer>

        <LabNotes direction="e" :page />
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
[data-lab="e"] {
    --ui-bg: #f5f0e8;
    --ui-bg-muted: #ece4d8;
    --ui-bg-elevated: #fbf8f3;
    --ui-bg-accented: #e3d8c7;
    --ui-bg-inverted: var(--color-ink-800);
    --ui-text: var(--color-ink-700);
    --ui-text-toned: var(--color-ink-700);
    --ui-text-muted: #5f5a52;
    --ui-text-highlighted: var(--color-ink-800);
    --ui-border: rgb(21 41 52 / 16%);
    --ui-border-accented: var(--color-ink-500);

    font-family: Inter, system-ui, sans-serif;
}

[data-lab="e"] :is(h1, h2, h3, blockquote, [data-display]) {
    font-family: Newsreader, Georgia, serif;
    font-weight: 400;
    letter-spacing: -0.015em;
}

[data-lab="e"] em {
    font-style: italic;
    color: var(--ui-secondary);
}
</style>
