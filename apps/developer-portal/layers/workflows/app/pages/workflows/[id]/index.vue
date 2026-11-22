<template>
    <UDashboardPanel id="workflow">
        <template #header>
            <PageHeader
                :crumbs="[{ label: $t('workflows.crumb'), to: '/workflows' }]"
                :title="base?.project.title ?? $t('workflow.fallback')"
            >
                <template #actions>
                    <WorkflowActions
                        :project="id"
                        :found="base !== undefined"
                        :synced-at="base?.syncedAt"
                    />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <WorkflowMissing v-if="!base || !view" :id />

            <div v-else class="flex flex-col gap-6">
                <WorkflowSummary :view :selected="selectedId" :blank @select="select" />
                <WorkflowAlerts :project="id" :blank :problems :unsorted />
                <WorkflowBoard
                    v-model:day="dayIndex"
                    :stages="view.stages"
                    :synced-stages="base.stages"
                    :active-stage
                    :active-index
                    :selected
                    :activity
                    :days="days.length"
                    :day-label
                    @select-stage="(stage) => (stageId = stage)"
                    @select="select"
                    @details="openDetails"
                />
                <WorkflowGraphSection
                    :view
                    :selected
                    :titles
                    @select="select"
                    @details="openDetails"
                />
            </div>

            <WorkflowDetails
                v-model:open="detailsOpen"
                :capability="selected"
                :stage="selectedStage"
                :project="id"
                :titles
                :activity="selectedActivity"
                :can-settle
                @select="select"
                @settle="settle"
            />
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { t } = useI18n();

const {
    id,
    base,
    problems,
    unsorted,
    replay,
    view,
    activity,
    blank,
    titles,
    selection,
    canSettle,
    settle,
    detailsOpen,
    openDetails,
    ready,
} = useWorkflowProject();
const { days, dayIndex, dayLabel } = replay;
const { selectedId, selected, stageId, activeIndex, activeStage, selectedStage, select } =
    selection;
const selectedActivity = computed(() =>
    selected.value ? activity.value?.capabilities[selected.value.id] : null,
);

useHead({ title: () => base.value?.project.title ?? t("workflow.fallback") });

await ready;
</script>
