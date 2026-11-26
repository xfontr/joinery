<template>
    <UDashboardPanel id="graph">
        <template #header>
            <PageHeader :title="$t('graph.title')">
                <template #actions>
                    <SnapshotAge :manifest artifact="projects" />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <div class="flex flex-col gap-4">
                <UAlert
                    v-for="finding in findings"
                    :key="finding.id"
                    color="warning"
                    variant="subtle"
                    icon="i-lucide-unlink"
                    :title="finding.title"
                    :description="finding.detail"
                />
                <GraphMap :projects />
                <GraphGroups :projects />
                <GraphEdges :projects />
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const manifest = snapshotManifest();
const projects = projectsArtifact()?.projects ?? [];
const findings = metricsArtifact()?.invariantFindings ?? [];
</script>
