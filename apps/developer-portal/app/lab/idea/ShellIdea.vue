<template>
    <div data-lab="idea" class="flex min-h-screen flex-col bg-default font-sans text-default">
        <header
            class="mx-auto flex w-full max-w-6xl items-baseline justify-between gap-6 px-5 py-6 md:px-10"
        >
            <NuxtLink to="/lab/idea" class="font-serif text-2xl text-highlighted italic">
                monorepo
            </NuxtLink>
            <nav class="flex items-baseline gap-6 text-sm" aria-label="Main">
                <NuxtLink to="/lab/idea#work" class="hidden hover:text-primary sm:inline">
                    In the works
                </NuxtLink>
                <NuxtLink to="/lab/idea/method" class="hover:text-primary">How it's made</NuxtLink>
                <NuxtLink to="/lab/idea/e/developer" class="text-primary"
                    >Developer view →</NuxtLink
                >
            </nav>
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="mx-auto w-full max-w-6xl px-5 py-16 md:px-10">
            <NuxtLink
                to="/lab/idea/e/developer"
                class="flex flex-col gap-2 border-t border-accented pt-8 md:flex-row md:items-baseline md:justify-between"
            >
                <span class="font-serif text-4xl text-highlighted">
                    Want everything? <em class="text-primary">Open the developer view.</em>
                </span>
                <span class="text-sm text-muted">Every decision, plan, audit and check, raw.</span>
            </NuxtLink>
        </footer>

        <LabNotes direction="idea" :page />
    </div>
</template>

<script setup lang="ts">
import LabNotes from "../LabNotes.vue";

interface Props {
    page: string;
}

defineProps<Props>();
</script>

<style src="./tokens.css"></style>
