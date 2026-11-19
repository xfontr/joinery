<template>
    <UDashboardPanel id="projects">
        <template #header>
            <UDashboardNavbar title="Projects">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <SnapshotAge :manifest="snapshot?.manifest ?? null" artifact="metrics" />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-6">
                <p v-if="groups.length === 0" class="p-8 text-center text-sm text-muted">
                    No projects collected yet.
                </p>

                <UCard v-for="group in groups" :key="group.label" variant="flush">
                    <template #header>
                        <div class="flex items-baseline justify-between gap-3">
                            <h2 class="font-semibold text-highlighted">{{ group.label }}</h2>
                            <span data-figure class="text-xl text-highlighted">
                                {{ group.rows.length }}
                            </span>
                        </div>
                    </template>

                    <div
                        class="hidden gap-4 border-b border-default px-4 py-2 text-xs text-muted sm:flex"
                        aria-hidden="true"
                    >
                        <span class="flex-1">Project</span>
                        <span v-for="column in COLUMNS" :key="column" class="w-24 text-right">
                            {{ column }}
                        </span>
                    </div>

                    <ul class="divide-y divide-default">
                        <li v-for="row in group.rows" :key="row.name">
                            <component
                                :is="row.to ? NuxtLink : 'div'"
                                :to="row.to ?? undefined"
                                class="flex flex-col gap-1 px-4 py-3 hover:bg-elevated sm:flex-row sm:items-baseline sm:gap-4"
                                :class="row.retired && 'text-muted'"
                            >
                                <span class="min-w-0 flex-1">
                                    <span class="block font-mono text-sm text-highlighted">
                                        {{ row.name }}
                                    </span>
                                    <span class="block truncate text-sm text-muted">
                                        {{ row.description }}
                                    </span>
                                </span>
                                <dl class="flex gap-4 font-mono text-xs sm:text-sm">
                                    <div
                                        v-for="figure in row.figures"
                                        :key="figure.label"
                                        class="flex gap-1.5 sm:w-24 sm:justify-end"
                                    >
                                        <dt class="text-muted sm:sr-only">{{ figure.label }}</dt>
                                        <dd class="tabular-nums" :class="figure.class">
                                            {{ figure.value }}
                                        </dd>
                                    </div>
                                </dl>
                            </component>
                        </li>
                    </ul>
                </UCard>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";

const COLUMNS = ["Coverage", "Specs", "Commits"] as const;

const { snapshot, projects, retired, metricFor, readmeFor } = await useCatalog();
const {
    public: { repoUrl },
} = useRuntimeConfig();

const groups = computed(() => {
    const live = projects.value.map((project) => {
        const metric = metricFor(project);

        return {
            name: project.name,
            category: categoryOf(project.root),
            description: readmeFor(project)?.description ?? "No description yet.",
            to: `/projects/${folderOf(project.root)}` as string | null,
            retired: false,
            figures: [
                {
                    label: "coverage",
                    value: dash(metric?.coverageLinesPct, "%"),
                    class: toneClass(coverageTone(metric?.coverageLinesPct)),
                },
                { label: "specs", value: dash(metric?.specs), class: "" },
                { label: "commits", value: dash(metric?.commits), class: "" },
            ],
        };
    });

    const deleted = retired.value.map((project) => ({
        name: project.name,
        category: "Retired",
        description: `Deleted ${project.deletedAt} · ${project.subject}`,
        to: repoUrl ? `${repoUrl}/commit/${project.commit}` : null,
        retired: true,
        figures: [
            { label: "coverage", value: "—", class: "" },
            { label: "specs", value: "—", class: "" },
            { label: "commits", value: String(project.commits), class: "" },
        ],
    }));

    const rows = [...live, ...deleted];
    const labels = [...new Set(rows.map((row) => row.category))];

    return labels.map((label) => ({
        label,
        rows: rows.filter((row) => row.category === label),
    }));
});
</script>
