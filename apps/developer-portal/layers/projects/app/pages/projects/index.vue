<template>
    <UDashboardPanel id="projects">
        <template #header>
            <PageHeader :title="current.label" :crumbs>
                <template #title>
                    <h1 class="flex items-baseline gap-2 text-2xl font-semibold text-highlighted">
                        {{ current.label }}
                        <span data-figure class="text-dimmed">{{ shown.length }}</span>
                    </h1>
                </template>
                <template #actions>
                    <UInput
                        v-model="search"
                        icon="i-lucide-search"
                        placeholder="Filter projects"
                        size="sm"
                        aria-label="Filter projects"
                    />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <div data-scroll-x class="overflow-x-auto border border-default bg-default">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th class="numeric hidden md:table-cell">Version</th>
                            <th class="numeric hidden md:table-cell">Unreleased</th>
                            <th class="numeric hidden md:table-cell">Commits, 2 wk</th>
                            <th class="numeric hidden md:table-cell">Specs</th>
                            <th class="numeric">Lines covered</th>
                            <th class="numeric hidden md:table-cell">Used by</th>
                        </tr>
                    </thead>
                    <tbody v-for="group in groups" :key="group.id">
                        <tr v-if="filter === 'all'">
                            <th
                                colspan="7"
                                scope="colgroup"
                                class="bg-muted text-left text-xs font-medium text-muted"
                            >
                                {{ group.label }}
                                <span class="font-mono">{{ group.rows.length }}</span>
                            </th>
                        </tr>
                        <tr v-for="row in group.rows" :key="row.root">
                            <td>
                                <NuxtLink :to="row.to" class="group flex flex-col">
                                    <span class="font-mono text-highlighted group-hover:underline">
                                        {{ row.name }}
                                    </span>
                                    <span class="max-w-xl text-xs text-muted">
                                        {{ row.description }}
                                    </span>
                                    <span class="mt-1 font-mono text-xs text-toned md:hidden">
                                        {{ row.compact }}
                                    </span>
                                </NuxtLink>
                            </td>
                            <td class="numeric hidden font-mono md:table-cell">
                                {{ row.version ?? "—" }}
                            </td>
                            <td
                                class="numeric hidden font-mono md:table-cell"
                                :class="
                                    row.unreleased ? 'font-medium text-highlighted' : 'text-dimmed'
                                "
                            >
                                {{ row.unreleased ? `+${row.unreleased}` : "—" }}
                            </td>
                            <td class="numeric hidden font-mono md:table-cell">
                                {{ row.recent ?? "—" }}
                            </td>
                            <td class="numeric hidden font-mono md:table-cell">
                                {{ row.specs ?? "—" }}
                            </td>
                            <td
                                data-meter
                                :style="{ '--pct': row.lines ?? 0 }"
                                class="numeric font-mono"
                                :class="row.tone"
                            >
                                {{ dash(row.lines, "%") }}
                            </td>
                            <td class="numeric hidden font-mono md:table-cell">
                                {{ row.usedBy }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="shown.length === 0" class="px-4 py-8 text-center text-sm text-muted">
                    {{ search ? `No project matches “${search}”.` : "No projects collected yet." }}
                </p>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
type KindId = "all" | "apps" | "packages" | "infrastructure";

const KINDS = [
    { id: "all", label: "All projects" },
    { id: "apps", label: "Apps" },
    { id: "packages", label: "Packages" },
    { id: "infrastructure", label: "Infrastructure" },
] as const satisfies { id: KindId; label: string }[];

const route = useRoute();
const filter = computed<KindId>(
    () => KINDS.find((kind) => kind.id === route.query.kind)?.id ?? "all",
);
const current = computed(() => KINDS.find((kind) => kind.id === filter.value) ?? KINDS[0]);
const crumbs = computed(() =>
    filter.value === "all" ? [] : [{ label: "projects", to: "/projects" }, { label: filter.value }],
);

const search = ref("");

const { projects, metricFor, readmeFor } = await useCatalog();

const rows = computed(() =>
    projects.value
        .map((project) => {
            const metric = metricFor(project);
            const version = metric?.currentVersion ?? null;
            const unreleased = metric?.unreleasedCommits ?? 0;
            const lines = metric?.coverageLinesPct ?? null;
            const usedBy = project.dependedOnBy.length;

            return {
                name: project.name,
                root: project.root,
                to: `/projects/${folderOf(project.root)}`,
                kind: project.root.split("/")[0] ?? "",
                description: readmeFor(project)?.description ?? "",
                version,
                unreleased,
                recent: metric?.commitsLastTwoWeeks ?? null,
                specs: metric?.specs ?? null,
                lines,
                tone: toneClass(coverageTone(lines)),
                usedBy,
                compact: [
                    version,
                    unreleased ? `+${unreleased} unreleased` : null,
                    `used by ${usedBy}`,
                ]
                    .filter(Boolean)
                    .join(" · "),
            };
        })
        .toSorted((a, b) => a.root.localeCompare(b.root)),
);

const shown = computed(() =>
    rows.value.filter(
        (row) =>
            (filter.value === "all" || row.kind === filter.value) &&
            row.name.toLowerCase().includes(search.value.toLowerCase()),
    ),
);

const groups = computed(() =>
    KINDS.filter((kind) => kind.id !== "all")
        .map((kind) => ({ ...kind, rows: shown.value.filter((row) => row.kind === kind.id) }))
        .filter((group) => group.rows.length > 0),
);
</script>
