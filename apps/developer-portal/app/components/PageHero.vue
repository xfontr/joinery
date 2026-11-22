<template>
    <UContainer as="section" class="flex flex-col gap-6 pt-10 pb-12 md:pt-20">
        <p v-if="kicker" class="font-mono text-xs text-muted uppercase">{{ kicker }}</p>
        <h1
            class="font-display text-section text-highlighted md:text-title lg:text-statement"
            :style="carriedTitle"
        >
            {{ title }} <mark>{{ mark }}</mark>
        </h1>
        <p class="max-w-2xl text-2xl text-highlighted">{{ lead }}</p>
        <slot />
    </UContainer>
</template>

<script setup lang="ts">
interface Props {
    kicker?: string;
    title: string;
    /** The title's last words, set in the accent. */
    mark: string;
    lead: string;
    /** The transition name the title shares with the link that led here. */
    carry?: string;
}

const { kicker, title, mark, lead, carry } = defineProps<Props>();

const carriedTitle = computed(() => (carry ? carried(carry) : undefined));
</script>
