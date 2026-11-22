<template>
    <section class="bg-muted">
        <div class="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-20 md:px-10">
            <h2 class="font-display text-section text-highlighted">
                {{ $t("agenticWorkflows.projects.title") }}
                <mark>{{ $t("agenticWorkflows.projects.titleMark") }}</mark>
            </h2>
            <article v-for="item in maps" :key="item.id" class="flex flex-col gap-5">
                <div
                    class="flex flex-col gap-2 border-t border-accented pt-6 md:flex-row md:items-baseline md:justify-between"
                >
                    <h3 class="font-display text-heading text-highlighted">{{ item.title }}</h3>
                    <p class="font-mono text-sm text-muted">{{ item.counts }}</p>
                </div>
                <WorkflowProjectMap :map="item.map" :label="item.label" />
                <ULink
                    :to="`/workflows/${item.id}`"
                    class="self-start text-primary underline underline-offset-4"
                >
                    {{ $t("agenticWorkflows.projects.open") }} →
                </ULink>
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
import { projectMap } from "#layers/workflows/shared/workflows.ts";

const { t } = useI18n();
const { data } = await useWorkflows();

const maps = computed(() =>
    data.value.projects.map((view) => {
        const map = projectMap(view);
        const blocks = t("agenticWorkflows.projects.blocks", map.blocks);
        return {
            id: view.project.id,
            title: view.project.title,
            label: t("agenticWorkflows.projects.mapLabel", { title: view.project.title }),
            map,
            counts: map.tickets
                ? t("agenticWorkflows.projects.tickets", { blocks, ...map.tickets })
                : blocks,
        };
    }),
);
</script>
