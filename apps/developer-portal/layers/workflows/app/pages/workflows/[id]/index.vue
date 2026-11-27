<template>
    <div class="relative flex min-h-0 flex-1">
        <UDashboardPanel id="workflow">
            <template #header>
                <PageHeader
                    :crumbs="[{ label: $t('workflows.crumb'), to: '/workflows' }]"
                    :title="base?.project.title ?? $t('workflow.fallback')"
                    :lead="base?.project.summary"
                >
                    <template v-if="view" #facts>
                        <WorkflowProgress :view />
                    </template>
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
                    <WorkflowAlerts :project="id" :blank />
                    <WorkflowBoard
                        v-model:day="dayIndex"
                        :stages="view.stages"
                        :capabilities="view.capabilities"
                        :synced-stages="base.stages"
                        :active-stage
                        :active-index
                        :selected
                        :activity
                        :days="days.length"
                        :day-label
                        @select-stage="(stage) => (stageId = stage)"
                        @select="pick"
                        @clear="deselect"
                    >
                        <template #summary>
                            <WorkflowSummary :view :selected="selectedId" :blank @select="pick" />
                        </template>
                        <template v-if="block && paneShown" #aside>
                            <WorkflowBlock v-bind="block" v-on="paneEvents" />
                        </template>
                    </WorkflowBoard>
                </div>
            </template>
        </UDashboardPanel>

        <WorkflowPane :offered="!paneShown && block !== null" @show="paneShown = true">
            <WorkflowDetails
                v-if="block && (paneShown || !wide)"
                v-model:open="detailsOpen"
                v-bind="block"
                v-on="paneEvents"
            />
        </WorkflowPane>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const {
    id,
    base,
    replay,
    view,
    activity,
    blank,
    titles,
    selection,
    canSettle,
    settle,
    wide,
    detailsOpen,
    pick,
    deselect,
    paneShown,
    ready,
} = useWorkflowProject();
const { days, dayIndex, dayLabel } = replay;
const { selectedId, selected, stageId, activeIndex, activeStage } = selection;

/** What the pane needs to show the selected block, wherever it is drawn. */
const block = computed(() => {
    const stages = view.value?.stages ?? [];
    const stageIndex = stages.findIndex((stage) => stage.id === selected.value?.stage);
    const stage = stages[stageIndex];
    if (!selected.value || !stage) return null;

    return {
        capability: selected.value,
        stage,
        stageIndex,
        project: id.value,
        titles: titles.value,
        activity: activity.value?.capabilities[selected.value.id] ?? null,
        canSettle: canSettle.value,
    };
});

const paneEvents = { select: pick, settle, hide: () => (paneShown.value = false) };

useHead({ title: () => base.value?.project.title ?? t("workflow.fallback") });

await ready;
</script>
