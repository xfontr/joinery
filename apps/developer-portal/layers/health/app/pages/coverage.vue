<template>
    <UDashboardPanel id="coverage">
        <template #header>
            <PageHeader :title="$t('coverage.title')" :lead="provenance">
                <template #facts>
                    <PageFacts :facts />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <HealthCoverageTable :projects :totals="coverage?.totals ?? null" />
            <HealthCoverageReport :copied="coverage?.report ?? false" />
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { coverage, projects, provenance, facts } = useCoveragePage();
</script>
