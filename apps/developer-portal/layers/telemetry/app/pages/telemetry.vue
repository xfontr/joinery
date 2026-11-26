<template>
    <UDashboardPanel id="telemetry">
        <template #header>
            <PageHeader :title="$t('telemetry.title')">
                <template #intro>
                    <PageFacts v-model:series="series" :provenance :facts />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <WidgetPanel v-if="!hasRuns" :title="$t('telemetry.empty.title')">
                <I18nT
                    keypath="telemetry.empty.body"
                    tag="p"
                    scope="global"
                    class="px-4 py-6 text-sm text-muted"
                >
                    <template #git>
                        <code class="font-mono">{{ GIT }}</code>
                    </template>
                    <template #folder>
                        <code class="font-mono">{{ FOLDER }}</code>
                    </template>
                    <template #command>
                        <code class="font-mono">{{ COLLECT }}</code>
                    </template>
                </I18nT>
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
const GIT = ".git";
const FOLDER = "data/telemetry/scripts";
const COLLECT = "pnpm exec nx collect @joinery/developer-portal";

const { usage, hasRuns, provenance, facts } = useTelemetryPage();
const series = ref("runs");
</script>
