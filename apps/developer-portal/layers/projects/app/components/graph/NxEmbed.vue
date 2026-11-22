<template>
    <UCard variant="flush">
        <template #header>
            <h2 class="font-semibold">Detailed Nx graph</h2>
            <p class="text-xs text-muted">
                Nx's own graph client, vendored in by the collector rather than redrawn.
            </p>
        </template>

        <iframe :src class="embedded-report h-130" title="Nx project graph" />
    </UCard>
</template>

<script setup lang="ts">
const src = embedUrl("/embed/graph/index.html");
</script>
