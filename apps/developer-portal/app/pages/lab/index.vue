<template>
    <main class="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-10">
        <h1 class="text-3xl font-semibold">Entry lab</h1>
        <a href="/lab/door" class="underline">Door: pick a view first</a>
        <a href="/lab/toggle" class="underline"
            >Toggle: visitor view, developer view one click away</a
        >
    </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
</script>
