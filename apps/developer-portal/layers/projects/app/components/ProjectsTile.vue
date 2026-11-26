<template>
    <NuxtLink
        to="/projects"
        class="flex h-full flex-col gap-1 rounded-lg border border-default bg-default p-4 transition-colors hover:bg-elevated/50"
    >
        <div class="flex items-center gap-1.5 text-xs text-muted">
            <UIcon name="i-lucide-boxes" class="size-3.5" />
            {{ $t("projectsTile.label") }}
        </div>

        <div data-figure class="text-2xl leading-none" :class="colorClass">
            {{ count }}
        </div>

        <div class="truncate text-xs text-dimmed">
            {{ hint }}
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
const count = projectsArtifact()?.projects.length ?? 0;
const findings = metricsArtifact()?.invariantFindings.length ?? 0;
const { t } = useI18n();
const hint = t("projectsTile.findings", findings);
const colorClass = toneClass(findings > 0 ? "warn" : "neutral");
</script>
