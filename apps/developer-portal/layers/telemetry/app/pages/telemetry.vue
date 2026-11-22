<template>
    <UDashboardPanel id="telemetry">
        <template #header>
            <PageHeader title="Tooling usage">
                <template #intro>
                    <PageFacts v-model:series="series" :provenance :facts />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <WidgetPanel v-if="!hasRuns" title="No runs committed yet">
                <p class="px-4 py-6 text-sm text-muted">
                    Scripts record each run into <code class="font-mono">.git</code>, and the next
                    commit carries the rows into
                    <code class="font-mono">data/telemetry/scripts</code>. Commit, then run
                    <code class="font-mono">pnpm exec nx collect @monorepo/developer-portal</code>.
                </p>
            </WidgetPanel>

            <template v-if="usage">
                <TelemetryDaily :usage :series />

                <TelemetryScriptActivity :usage />

                <TelemetryUsageTriage :usage />

                <TelemetryLintUsage :lint="usage.lint" />
            </template>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { usage, hasRuns, provenance, facts } = useTelemetryPage();
const series = ref("runs");
</script>
