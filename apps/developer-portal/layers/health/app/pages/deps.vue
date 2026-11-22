<template>
    <UDashboardPanel id="deps">
        <template #header>
            <PageHeader title="Dependencies">
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
const { deps, provenance, facts, ready } = useDepsPage();

await ready;
</script>
