<template>
    <section v-if="maps.length" class="dark bg-muted text-default">
        <UContainer class="flex flex-col gap-20 py-24">
            <h2 v-if="!project" class="text-section text-highlighted">
                {{ $t("agenticWorkflows.projects.title") }}
                <mark>{{ $t("agenticWorkflows.projects.titleMark") }}</mark>
            </h2>
            <article
                v-for="item in maps"
                :key="item.id"
                class="page-grid gap-y-8 border-t border-accented pt-5"
            >
                <div
                    class="col-span-4 flex flex-col gap-2"
                    :class="item.wide && 'md:col-span-12 md:flex-row md:items-baseline md:gap-8'"
                >
                    <component :is="project ? 'h2' : 'h3'" class="text-heading text-highlighted">
                        {{ item.title }}
                    </component>
                    <p class="text-base text-highlighted">{{ item.done }}</p>
                    <ULink
                        raw
                        :to="portalUrl(`/workflows/${item.id}`)"
                        class="self-start link"
                        :class="item.wide ? 'md:ml-auto' : 'mt-2'"
                    >
                        {{ $t("agenticWorkflows.projects.open") }} ↗
                    </ULink>
                </div>
                <WorkflowProjectMap
                    :map="item.map"
                    :label="item.label"
                    class="col-span-4"
                    :class="item.wide ? 'md:col-span-12' : 'md:col-span-8'"
                />
            </article>
        </UContainer>
    </section>
</template>

<script setup lang="ts">
const { project } = defineProps<Props>();

/** Wider than this, in the map's own units, a map gets the full width under its heading. */
const WIDE = 800;

interface Props {
    /** Show only this project's map, as a case study does; unset shows every map. */
    project?: string;
}

const { t } = useI18n();
const { data: projects } = await useWorkflowMaps();

const maps = computed(() =>
    projects.value
        .filter(({ id }) => !project || id === project)
        .map(({ id, title, map }) => ({
            id,
            title,
            map,
            wide: map.width > WIDE,
            label: t("agenticWorkflows.projects.mapLabel", { title }),
            done: t("agenticWorkflows.projects.done", {
                percent: map.blocks.total
                    ? Math.round((map.blocks.done / map.blocks.total) * 100)
                    : 0,
            }),
        })),
);
</script>
