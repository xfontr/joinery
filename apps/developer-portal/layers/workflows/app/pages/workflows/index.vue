<template>
    <UDashboardPanel id="workflows">
        <template #header>
            <PageHeader title="Workflows">
                <template #actions>
                    <UButton
                        to="/wiki/docs/workflows/readme"
                        label="How workflows work"
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
                <p class="max-w-3xl text-sm text-muted">
                    A workflow is a map of every block a kind of project needs and what each one
                    needs first, learned from the ones already shipped. Each project picks its
                    features, files the blocks as GitHub tickets with their blocked-by links, and
                    from then on GitHub says where it stands.
                </p>

                <WorkflowProblems :problems="data.problems" />
                <WorkflowProjects :projects="data.projects" />
                <WorkflowTemplates :templates="data.templates" />
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
useHead({ title: "Workflows" });

const { data } = await useWorkflows();
</script>
