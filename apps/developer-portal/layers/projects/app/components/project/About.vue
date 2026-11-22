<template>
    <WidgetPanel title="About" :meta="project.root">
        <dl class="divide-y divide-default text-sm">
            <div
                v-for="fact in facts"
                :key="fact.label"
                class="flex items-baseline justify-between gap-3 px-4 py-2"
            >
                <dt class="text-muted">{{ fact.label }}</dt>
                <dd
                    class="font-mono tabular-nums"
                    :class="fact.class ?? 'text-highlighted'"
                    :data-meter="fact.pct !== undefined || undefined"
                    :style="fact.pct === undefined ? undefined : { '--pct': fact.pct }"
                >
                    {{ fact.value }}
                </dd>
            </div>
            <div v-for="list in relations" :key="list.label" class="px-4 py-2.5">
                <dt class="flex justify-between text-muted">
                    {{ list.label }}
                    <span class="font-mono text-xs">{{ list.items.length }}</span>
                </dt>
                <dd v-if="list.items.length === 0" class="text-dimmed">None</dd>
                <dd v-for="item in list.items" v-else :key="item.name">
                    <NuxtLink
                        :to="item.to"
                        class="block truncate font-mono text-xs text-highlighted hover:underline"
                    >
                        {{ item.name }}
                    </NuxtLink>
                </dd>
            </div>
            <div class="px-4 py-2.5">
                <dt class="text-muted">Tags</dt>
                <dd class="flex flex-wrap gap-x-3 font-mono text-xs text-highlighted">
                    <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
                </dd>
            </div>
        </dl>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";

interface Props {
    project: ProjectNode;
    metric: ProjectMetrics | undefined;
    /** Every collected project, to link a dependency to its own page. */
    projects: ProjectNode[];
    coveragePct: number | null;
}

const { project, metric, projects, coveragePct } = defineProps<Props>();

const facts = computed((): { label: string; value: string; class?: string; pct?: number }[] => [
    { label: "Version", value: metric?.currentVersion ?? "—" },
    {
        label: "Unreleased",
        value: metric?.unreleasedCommits ? `+${metric.unreleasedCommits}` : "—",
    },
    { label: "Commits, 2 wk", value: dash(metric?.commitsLastTwoWeeks) },
    { label: "Specs", value: dash(metric?.specs) },
    {
        label: "Lines covered",
        value: dash(coveragePct, "%"),
        class: toneClass(coverageTone(coveragePct)) || undefined,
        ...(coveragePct !== null && { pct: coveragePct }),
    },
    { label: "Changelog", value: metric?.hasChangelog ? "yes" : "no" },
]);

const pageFor = (packageName: string): string => {
    const found = projects.find((candidate) => candidate.name === packageName);
    return found ? `/projects/${folderOf(found.root)}` : "/projects";
};

const linked = (names: string[]) =>
    [...new Set(names)].map((item) => ({ name: item, to: pageFor(item) }));

const relations = computed(() => [
    { label: "Depends on", items: linked(project.dependsOn) },
    { label: "Used by", items: linked(project.dependedOnBy) },
]);
</script>
