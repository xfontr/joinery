<template>
    <NuxtLink
        data-view-switch
        :to="portal"
        class="shrink-0 font-mono text-meta text-muted hover:text-primary"
    >
        {{ $t("portalLink") }}
    </NuxtLink>
</template>

<script setup lang="ts">
const portal = portalUrl("/");
</script>
