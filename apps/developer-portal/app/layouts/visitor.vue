<template>
    <div data-identity class="flex min-h-screen flex-col">
        <header
            class="mx-auto flex w-full max-w-6xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-4 py-6 md:px-10"
        >
            <ULink to="/" class="font-display text-2xl text-highlighted italic">monorepo</ULink>
            <nav class="flex items-baseline gap-6 text-sm" aria-label="Main">
                <ULink to="/method" active-class="text-primary">How it's made</ULink>
                <ULink to="/how-its-run" active-class="text-primary">How it's run</ULink>
                <ULink :to="DEVELOPER_VIEW" class="text-primary">Developer view →</ULink>
            </nav>
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="mx-auto w-full max-w-6xl px-4 py-16 md:px-10">
            <ULink
                :to="DEVELOPER_VIEW"
                class="flex flex-col gap-2 border-t border-accented pt-8 md:flex-row md:items-baseline md:justify-between"
            >
                <span class="font-display text-heading text-highlighted">
                    Want everything? <mark>Open the developer view.</mark>
                </span>
                <span class="text-sm text-muted">Every decision, plan, audit and check, raw.</span>
            </ULink>
        </footer>
    </div>
</template>

<script setup lang="ts">
// Becomes `/overview` once the visitor front page takes `/` (#485).
const DEVELOPER_VIEW = "/";
</script>
