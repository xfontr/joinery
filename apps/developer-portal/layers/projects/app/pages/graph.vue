<template>
    <UDashboardPanel id="graph">
        <template #header>
            <PageHeader :title="$t('graph.title')" />
        </template>

        <template #body>
            <div class="flex flex-col gap-4">
                <GraphMap :projects />
                <GraphGroups :projects />
                <GraphEdges :projects />
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const projects = projectsArtifact()?.projects ?? [];
</script>
