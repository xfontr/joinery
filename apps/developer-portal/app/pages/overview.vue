<template>
    <UDashboardPanel id="overview">
        <template #header>
            <PageHeader title="Home">
                <template #actions>
                    <SnapshotAge class="mr-3 hidden sm:flex" :manifest="docs?.manifest ?? null" />
                    <UButton
                        :label="editing ? 'Done' : 'Customize'"
                        :icon="editing ? 'i-lucide-check' : 'i-lucide-layout-grid'"
                        size="sm"
                        :variant="editing ? 'solid' : 'outline'"
                        color="neutral"
                        @click="editing = !editing"
                    />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <DashboardGrid
                v-model:editing="editing"
                :widgets="HOME_WIDGETS"
                :empty
                storage-key="home-layout"
            >
                <template #queue>
                    <WorkQueue :rows :issues-read :issues-error />
                </template>
                <template #health>
                    <HealthLines :lines="health" :collected-age />
                </template>
                <template #workflows><WorkflowHomePanel /></template>
                <template #activity><TelemetryRunsPanel /></template>
                <template #tooling><TelemetryUsagePanel /></template>
                <template #projects><ProjectsTile /></template>
                <template #welcome><ProjectsWelcome /></template>
                <template #featured><ProjectsFeatured /></template>
            </DashboardGrid>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const editing = ref(false);

const { rows, issues } = useWorkQueue();
const health = useHealthLines();

const [{ data: docs }, { data: metrics }, { data: usage }] = await Promise.all([
    useSnapshot("docs"),
    useSnapshot("metrics"),
    useSnapshot("usage"),
]);

const collectedAge = computed(() => relativeTime(metrics.value?.metrics?.generatedAt));
const issuesRead = computed(() => Boolean(issues.value.fetchedAt));
const issuesError = computed(() => Boolean(issues.value.error));
const empty = computed(() => (usage.value?.usage ? [] : ["activity"]));
</script>
