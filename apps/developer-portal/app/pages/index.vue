<template>
    <div />
</template>

<script setup lang="ts">
// The prerendered `/` is then a meta-refresh page, the one redirect GitHub Pages can serve.
await navigateTo("/overview", { redirectCode: 301 });
</script>
