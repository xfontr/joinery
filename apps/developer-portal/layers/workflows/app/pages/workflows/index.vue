<template>
    <UDashboardPanel id="workflows">
        <template #header>
            <PageHeader :title="$t('workflows.title')" />
        </template>

        <template #body>
            <div class="flex flex-col gap-6">
                <p class="max-w-3xl text-sm text-muted">
                    {{ $t("workflows.intro") }}
                    <ULink to="/wiki/docs/workflows/readme" class="text-default underline">{{
                        $t("workflows.guide")
                    }}</ULink>
                </p>

                <WorkflowProblems :problems="data.problems" />
                <WorkflowProjects :projects="data.projects" />
                <WorkflowTemplates :templates="data.templates" />
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { t } = useI18n();

useHead({ title: t("workflows.title") });

const { data } = await useWorkflows();
</script>
