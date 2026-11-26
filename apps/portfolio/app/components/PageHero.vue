<template>
    <UContainer as="section" class="page-grid gap-y-8 pt-10 pb-24 md:pt-20">
        <h1 class="col-span-4 text-title text-highlighted md:col-span-10" :style="carriedTitle">
            {{ title }} <mark>{{ mark }}</mark>
        </h1>
        <div class="col-span-4 flex flex-col gap-5 md:col-span-5 md:col-start-7">
            <p class="text-lead text-highlighted">{{ lead }}</p>
            <slot />
        </div>
    </UContainer>
</template>

<script setup lang="ts">
interface Props {
    title: string;
    /** The title's last words, set in the accent. */
    mark: string;
    lead: string;
    /** The transition name the title shares with the link that led here. */
    carry?: string;
}

const { title, mark, lead, carry } = defineProps<Props>();

const carriedTitle = computed(() => (carry ? carried(carry) : undefined));
</script>
