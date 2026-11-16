<template>
    <div :data-lab="direction" class="flex min-h-screen flex-col bg-default text-default">
        <header :data-dark="dark || undefined">
            <div
                class="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 md:px-10"
            >
                <NuxtLink :to="base" class="flex flex-col leading-tight">
                    <span data-display class="text-lg font-semibold text-highlighted"
                        >Marina Roustan</span
                    >
                    <span class="text-sm text-muted">Psicóloga clínica</span>
                </NuxtLink>
                <nav class="hidden items-center gap-8 text-base md:flex" aria-label="Principal">
                    <NuxtLink
                        v-for="item in links"
                        :key="item.anchor"
                        :to="`${base}#${item.anchor}`"
                        class="hover:text-highlighted"
                    >
                        {{ item.label }}
                    </NuxtLink>
                </nav>
                <UButton
                    :to="`${base}/contacto`"
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

        <LabNotes :direction :page />
    </div>
</template>

<script setup lang="ts">
import LabNotes from "./LabNotes.vue";
import { contact, copy, nav, type Direction } from "./fixtures";

interface Props {
    direction: Direction;
    page: string;
    dark?: boolean;
    anchors?: { label: string; anchor: string }[];
}

const props = defineProps<Props>();

const links = computed(() => props.anchors ?? nav);

const base = computed(() => `/lab/${props.direction}`);
</script>

<style>
:is([data-lab="g"], [data-lab="h"], [data-lab="i"], [data-lab="j"], [data-lab="k"]) {
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
}

[data-lab="g"] {
    font-family: "Inter Tight", Inter, system-ui, sans-serif;
}

[data-lab="g"] :is(h1, h2, h3) {
    font-weight: 500;
    letter-spacing: -0.03em;
}

[data-lab="h"],
[data-lab="j"],
[data-lab="k"] {
    font-family: Inter, system-ui, sans-serif;
}

:is([data-lab="h"], [data-lab="j"], [data-lab="k"]) :is(h1, h2, h3, [data-display]) {
    font-family: Newsreader, Georgia, serif;
    font-weight: 400;
    letter-spacing: -0.015em;
}

:is([data-lab="h"], [data-lab="j"], [data-lab="k"]) em {
    font-style: italic;
    color: var(--ui-secondary);
}

[data-lab="i"] {
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
}

[data-lab="i"] :is(h1, h2, h3) {
    font-weight: 600;
    letter-spacing: -0.03em;
}

/* Navy surfaces flip the roles, so the same classes and the neutral button read on them */
:is([data-lab="g"], [data-lab="h"], [data-lab="i"], [data-lab="j"], [data-lab="k"]) [data-dark] {
    --ui-text: var(--color-ink-200);
    --ui-text-muted: var(--color-ink-300);
    --ui-text-highlighted: #fff;
    --ui-border: rgb(255 255 255 / 16%);
    --ui-bg-inverted: var(--color-paper-50);
    --ui-text-inverted: var(--color-ink-800);

    color: var(--ui-text);
    background-color: var(--color-ink-800);
}

:is([data-lab="h"], [data-lab="j"], [data-lab="k"]) [data-dark] em {
    color: var(--color-ochre-300);
}
[data-lab="l"],
[data-lab="lk"],
[data-lab="n"],
[data-lab="o"] {
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
}

[data-lab="l"],
[data-lab="lk"],
[data-lab="n"],
[data-lab="o"] {
    font-family: "Inter Tight", Inter, system-ui, sans-serif;
}

[data-lab="l"] :is(h1, h2, h3),
[data-lab="lk"] :is(h1, h2, h3),
[data-lab="n"] :is(h1, h2, h3),
[data-lab="o"] :is(h1, h2, h3) {
    font-weight: 500;
    letter-spacing: -0.03em;
}

:is([data-lab="l"], [data-lab="lk"], [data-lab="n"], [data-lab="o"]) [data-dark] {
    --ui-text: var(--color-ink-200);
    --ui-text-muted: var(--color-ink-300);
    --ui-text-highlighted: #fff;
    --ui-border: rgb(255 255 255 / 16%);
    --ui-bg-inverted: var(--color-paper-50);
    --ui-text-inverted: var(--color-ink-800);

    color: var(--ui-text);
    background-color: var(--color-ink-800);
}

/* N's signature: sans headlines with a serif italic accent */
:is([data-lab="n"], [data-lab="o"]) em {
    font-family: Newsreader, Georgia, serif;
    font-style: italic;
    font-weight: 400;
    letter-spacing: -0.01em;
    color: var(--ui-secondary);
}

:is([data-lab="n"], [data-lab="o"]) [data-dark] em {
    color: var(--color-ochre-300);
}
</style>
