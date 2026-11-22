<template>
    <StatTile
        class="h-full"
        label="Projects"
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
const hint = counted(findings, "invariant finding");
</script>
