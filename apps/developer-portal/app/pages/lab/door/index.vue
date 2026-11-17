<template>
    <main class="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10 md:px-8">
        <h1 class="text-6xl font-semibold text-highlighted md:text-8xl">
            Software built with care, sped up by AI, for the people who use it.
        </h1>
        <div class="grid gap-4 md:grid-cols-2">
            <a href="/lab/door/visitor" class="border border-default p-6" data-lab="visitor-choice">
                <span class="text-2xl font-semibold">See what it makes</span>
                <span class="block text-base text-muted">The apps, and how they're built.</span>
            </a>
            <a href="/" class="border border-default p-6" data-lab="developer-choice">
                <span class="text-2xl font-semibold">Read the engineering</span>
                <span class="block text-base text-muted">Projects, docs, health and tooling.</span>
            </a>
        </div>
    </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
</script>
