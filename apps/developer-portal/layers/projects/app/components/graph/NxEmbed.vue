<template>
    <UCard variant="flush">
        <template #header>
            <h2 class="font-semibold">{{ $t("graphNxEmbed.title") }}</h2>
            <p class="text-xs text-muted">{{ $t("graphNxEmbed.lead") }}</p>
        </template>

        <iframe :src class="embedded-report h-130" :title="$t('graphNxEmbed.frame')" />
    </UCard>
</template>

<script setup lang="ts">
const src = embedUrl("/embed/graph/index.html");
</script>
