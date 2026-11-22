<template>
    <StatTile
        class="h-full"
        :label="$t('projectsTile.label')"
        :value="count"
        :hint
        :tone="findings > 0 ? 'warn' : 'neutral'"
        icon="i-lucide-boxes"
        to="/projects"
    />
</template>

<script setup lang="ts">
const count = projectsArtifact()?.projects.length ?? 0;
const findings = metricsArtifact()?.invariantFindings.length ?? 0;
const { t } = useI18n();
const hint = t("projectsTile.findings", findings);
</script>
