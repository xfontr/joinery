<template>
    <UDashboardPanel id="workflow-new">
        <template #header>
            <PageHeader :crumbs="[{ label: 'workflows', to: '/workflows' }]" title="New project">
                <template #actions>
                    <UButton
                        to="/workflows"
                        label="Cancel"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                    />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <div class="mx-auto flex w-full max-w-5xl flex-col gap-8">
                <UStepper v-model="step" :items="steps" disabled class="w-full" />

                <div class="grid gap-6 lg:grid-cols-3">
                    <section class="flex flex-col gap-4 lg:col-span-2">
                        <WizardStep
                            v-model:title="draft.title"
                            v-model:summary="draft.summary"
                            v-model:id="id"
                            v-model:milestone="milestone"
                            v-model:area="area"
                            v-model:pages="draft.pages"
                            v-bind="view"
                            @pick-template="pickTemplate"
                            @toggle="toggle"
                            @submit="next"
                        />
                        <WizardFooter
                            v-bind="footer"
                            @back="back"
                            @next="next"
                            @create="create"
                            @download="download"
                        />
                    </section>

                    <aside class="lg:sticky lg:top-4 lg:self-start">
                        <WizardSummary v-model:ticket-size="draft.ticketSize" v-bind="summary" />
                    </aside>
                </div>
            </div>

            <WorkflowLeaveModal
                v-model:open="leaving"
                title="Leave without creating?"
                description="Nothing picked on this page is in a project file yet."
                action="Leave without creating"
                @leave="leave"
            />
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
useHead({ title: "New project" });

const {
    draft,
    step,
    steps,
    id,
    milestone,
    area,
    pickTemplate,
    toggle,
    next,
    back,
    create,
    download,
    leaving,
    leave,
    view,
    footer,
    summary,
    ready,
} = useNewProject();

await ready;
</script>
