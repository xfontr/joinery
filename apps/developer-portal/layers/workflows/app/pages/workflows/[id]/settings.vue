<template>
    <UDashboardPanel id="workflow-settings">
        <template #header>
            <PageHeader
                :crumbs
                :title="
                    base
                        ? $t('workflowSettings.titleOf', { project: base.project.title })
                        : $t('workflowSettings.title')
                "
            >
                <template #actions>
                    <UButton
                        :to="`/workflows/${id}`"
                        :label="$t('workflowSettings.back')"
                        icon="i-lucide-arrow-left"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                    />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <WorkflowMissing v-if="!base" :id />

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
                :title="$t('workflowSettings.leave.title')"
                :description="$t('workflowSettings.leave.description')"
                :action="$t('workflowSettings.leave.action')"
                @leave="leave"
            />
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { t } = useI18n();

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
    { label: t("workflows.crumb"), to: "/workflows" },
    { label: id.value, to: `/workflows/${id.value}` },
]);

useHead({
    title: () =>
        t("workflowSettings.titleOf", {
            project: base.value?.project.title ?? t("workflow.fallback"),
        }),
});

await ready;
</script>
