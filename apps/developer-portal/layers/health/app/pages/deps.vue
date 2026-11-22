<template>
    <UDashboardPanel id="deps">
        <template #header>
            <PageHeader :title="$t('deps.title')">
                <template #intro>
                    <PageFacts :provenance :facts />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <HealthAdvisories
                :advisories="deps?.advisories ?? []"
                :counts="deps?.vulnerabilities ?? null"
            />
            <HealthOutdated :outdated="deps?.outdated ?? null" />
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { deps, provenance, facts } = useDepsPage();
</script>
