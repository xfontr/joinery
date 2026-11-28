<template>
    <div />
</template>

<script setup lang="ts">
// The server renders the error page either way, and Nitro logs every fatal error it serves
throw createError({ status: 404, fatal: import.meta.client });
</script>
