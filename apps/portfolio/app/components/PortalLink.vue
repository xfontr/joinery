<template>
    <NuxtLink
        data-view-switch
        :to="portal"
        class="shrink-0 text-sm text-highlighted underline underline-offset-4"
    >
        {{ $t("portalLink") }}
    </NuxtLink>
</template>

<script setup lang="ts">
const portal = portalUrl("/");
</script>
