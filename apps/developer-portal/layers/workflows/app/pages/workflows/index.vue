<template>
    <UDashboardPanel id="workflows">
        <template #header>
            <PageHeader :title="$t('workflows.title')">
                <template #actions>
                    <UButton
                        to="/wiki/docs/workflows/readme"
                        :label="$t('workflows.guide')"
                        icon="i-lucide-ruler"
                        color="neutral"
                        variant="ghost"
                        size="xs"
                    />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <div class="flex flex-col gap-6">
                <p class="max-w-3xl text-sm text-muted">{{ $t("workflows.intro") }}</p>

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
