<template>
    <UDashboardPanel id="graph">
        <template #header>
            <PageHeader title="Project graph">
                <template #actions>
                    <SnapshotAge :manifest="snapshot?.manifest ?? null" artifact="projects" />
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
                <GraphNxEmbed />
                <GraphGroups :projects />
                <GraphEdges :projects />
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { data: snapshot } = await useSnapshot("projects");
const { data: metricsSnapshot } = await useSnapshot("metrics");

const projects = computed(() => snapshot.value?.projects?.projects ?? []);
const findings = computed(() => metricsSnapshot.value?.metrics?.invariantFindings ?? []);
</script>
