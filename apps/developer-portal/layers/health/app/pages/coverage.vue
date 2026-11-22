<template>
    <UDashboardPanel id="coverage">
        <template #header>
            <PageHeader title="Coverage">
                <template #intro>
                    <PageFacts :provenance :facts />
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
