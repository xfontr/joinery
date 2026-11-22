<template>
    <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-12 md:px-10 md:pt-20">
        <p v-if="kicker" class="font-mono text-xs text-muted uppercase">{{ kicker }}</p>
        <h1 class="font-display text-section text-highlighted md:text-title lg:text-statement">
            {{ title }} <mark>{{ mark }}</mark>
        </h1>
        <p class="max-w-2xl text-2xl text-highlighted">{{ lead }}</p>
        <slot />
    </section>
</template>

<script setup lang="ts">
interface Props {
    kicker?: string;
    title: string;
    /** The title's last words, set in the accent. */
    mark: string;
    lead: string;
}

const { kicker, title, mark, lead } = defineProps<Props>();
</script>
