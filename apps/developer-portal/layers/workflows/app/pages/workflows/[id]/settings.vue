<template>
    <UDashboardPanel id="workflow-settings">
        <template #header>
            <PageHeader :crumbs :title="base ? `${base.project.title} · Settings` : 'Settings'">
                <template #actions>
                    <UButton
                        :to="`/workflows/${id}`"
                        label="Back to the project"
                        icon="i-lucide-arrow-left"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                    />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <EmptyState v-if="!base">
                No project <code class="font-mono">{{ id }}</code> under
                <code class="font-mono">data/workflows/projects/</code>.
            </EmptyState>

            <div v-else class="mx-auto flex w-full max-w-4xl flex-col gap-10">
                <SettingsReadOnly v-if="!editable" />
                <SettingsGeneral
                    v-model:title="draft.title"
                    v-model:summary="draft.summary"
                    v-model:milestone="draft.milestone"
                    v-model:area="draft.area"
                    :template="base.template.title"
                    :editable
                />
                <SettingsFeatures :features :editable @toggle="toggle" />
                <SettingsTicketSize
                    v-model="draft.ticketSize"
                    :counts="base.tickets.toFile"
                    :editable="editable && !sizeFixed"
                />
                <template v-if="editable">
                    <SettingsSave :changed :saving @save="save" @discard="discard" />
                    <SettingsRemove
                        :project="id"
                        :title="base.project.title"
                        :issues="base.snapshot?.issues ?? []"
                        @remove="remove"
                    />
                </template>
            </div>

            <WorkflowLeaveModal
                v-model:open="leaving"
                title="Leave without saving?"
                description="The changes on this page aren't in the project file yet."
                action="Leave without saving"
                @leave="leave"
            />
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const {
    id,
    base,
    editable,
    draft,
    sizeFixed,
    features,
    toggle,
    changed,
    saving,
    save,
    discard,
    leaving,
    leave,
    remove,
    ready,
} = useWorkflowSettings();

const crumbs = computed(() => [
    { label: "workflows", to: "/workflows" },
    { label: id.value, to: `/workflows/${id.value}` },
]);

useHead({ title: () => `${base.value?.project.title ?? "Workflow"} · Settings` });

await ready;
</script>
