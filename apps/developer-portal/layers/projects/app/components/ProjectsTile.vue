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
const [{ data: projects }, { data: metrics }] = await Promise.all([
    useSnapshot("projects"),
    useSnapshot("metrics"),
]);

const count = computed(() => projects.value?.projects?.projects.length ?? 0);
const findings = computed(() => metrics.value?.metrics?.invariantFindings.length ?? 0);
const hint = computed(() => counted(findings.value, "invariant finding"));
</script>
