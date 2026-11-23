<template>
    <nav
        data-view-switch
        class="inline-flex shrink-0 items-center gap-0.5 rounded-md p-0.5 font-mono text-xs ring ring-default"
        :aria-label="$t('viewSwitch.label')"
    >
        <NuxtLink
            to="/"
            aria-current="true"
            class="rounded-sm bg-elevated px-2 py-0.5 text-highlighted"
        >
            {{ $t("viewSwitch.visitor") }}
        </NuxtLink>
        <NuxtLink :to="portal" class="rounded-sm px-2 py-0.5 text-muted hover:text-highlighted">
            {{ $t("viewSwitch.dev") }}
        </NuxtLink>
    </nav>
</template>

<script setup lang="ts">
const portal = portalUrl("/");
</script>
