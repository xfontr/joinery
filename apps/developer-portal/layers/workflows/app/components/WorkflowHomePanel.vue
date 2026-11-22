<template>
    <WidgetPanel
        :title="$t('workflowHomePanel.title')"
        :meta="$t('workflowHomePanel.meta')"
        :count="rows.length"
        to="/workflows"
        :all="{ label: $t('workflowHomePanel.new'), to: '/workflows/new' }"
    >
        <EmptyState v-if="rows.length === 0">{{ $t("workflowHomePanel.none") }}</EmptyState>
        <ul v-else class="divide-y divide-default">
            <li v-for="card in rows" :key="card.id">
                <NuxtLink
                    :to="`/workflows/${card.id}`"
                    class="flex flex-col gap-2 px-4 py-3 hover:bg-elevated"
                >
                    <div class="flex items-baseline justify-between gap-3">
                        <span class="min-w-0">
                            <span class="block truncate text-sm font-medium text-highlighted">
                                {{ card.title }}
                            </span>
                            <span class="block truncate text-xs text-muted">
                                {{ card.templateTitle }}
                            </span>
                        </span>
                        <span data-figure class="shrink-0 text-xl leading-none text-highlighted">
                            {{ card.percent }}<span class="text-sm text-muted">%</span>
                        </span>
                    </div>
                    <SplitBar :parts="card.parts" />
                </NuxtLink>
            </li>
        </ul>
    </WidgetPanel>
</template>

<script setup lang="ts">
import { activeProjects, projectCard } from "#layers/workflows/shared/workflows.ts";
import type { SplitPart } from "~/types/SplitPart";

const { t } = useI18n();
const { data: workflows } = await useWorkflows();

const rows = computed(() =>
    activeProjects(workflows.value.projects).map((view) => ({
        ...projectCard(view),
        parts: [
            { label: t("workflowHomePanel.parts.done"), value: view.progress.done, tone: "ink" },
            {
                label: t("workflowHomePanel.parts.left"),
                value: view.progress.total - view.progress.done,
                tone: "soft",
            },
        ] satisfies SplitPart[],
    })),
);
</script>
