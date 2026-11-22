<template>
    <DShell
        app="catalog"
        :page="project?.name ?? 'Project'"
        :crumbs="[{ label: folder }]"
        :sections
        :tabs
    >
        <template #title>
            <h1 class="truncate font-mono text-2xl font-semibold text-highlighted">
                {{ project?.name ?? folder }}
            </h1>
        </template>
        <template #intro>
            <p v-if="readme?.description" class="mt-2 max-w-3xl px-4 text-sm text-toned md:px-6">
                {{ readme.description }}
            </p>
        </template>

        <p v-if="!project" class="text-muted">No project lives in a folder called {{ folder }}.</p>

        <div v-else class="grid items-start gap-6 lg:grid-cols-4">
            <aside class="order-first lg:sticky lg:top-6 lg:order-last">
                <DBox title="About" :meta="project.root">
                    <dl class="divide-y divide-default text-sm">
                        <div
                            v-for="fact in facts"
                            :key="fact.label"
                            class="flex items-baseline justify-between gap-3 px-4 py-2"
                        >
                            <dt class="text-muted">{{ fact.label }}</dt>
                            <dd
                                class="font-mono"
                                :class="fact.class || 'text-highlighted'"
                                :data-meter="fact.pct !== undefined || undefined"
                                :style="fact.pct !== undefined ? { '--pct': fact.pct } : undefined"
                            >
                                {{ fact.value }}
                            </dd>
                        </div>
                        <div v-for="list in links" :key="list.title" class="px-4 py-2.5">
                            <dt class="flex justify-between text-muted">
                                {{ list.title }}
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
                </DBox>
            </aside>

            <div class="min-w-0 lg:col-span-3">
                <article
                    v-if="tab === 'readme'"
                    data-readme
                    class="overflow-x-auto border border-default bg-default px-6 py-5"
                >
                    <ContentRenderer v-if="readme" :value="readme" />
                    <p v-else class="text-muted">This project has no README.</p>
                </article>

                <DBox
                    v-else-if="tab === 'coverage'"
                    title="Coverage"
                    :meta="
                        coverage?.collected
                            ? `Vitest · ${coverage.files} files · collected ${coverageAge}`
                            : 'Not collected'
                    "
                    :to="`${BASE}/health?tab=coverage`"
                >
                    <dl v-if="coverageRows.length > 0" class="grid sm:grid-cols-2">
                        <div
                            v-for="row in coverageRows"
                            :key="row.label"
                            class="flex flex-col gap-2 border-b border-default p-4 sm:odd:border-r"
                        >
                            <div class="flex items-baseline justify-between gap-3">
                                <dt class="text-sm text-toned first-letter:uppercase">
                                    {{ row.label }}
                                </dt>
                                <dd data-figure class="text-2xl leading-none" :class="row.tone">
                                    {{ row.pct }}%
                                </dd>
                            </div>
                            <DSplit
                                :parts="[
                                    { label: 'covered', value: row.covered, tone: 'ink' },
                                    {
                                        label: 'not covered',
                                        value: row.total - row.covered,
                                        tone: 'soft',
                                    },
                                ]"
                            />
                        </div>
                    </dl>
                    <p v-else class="px-4 py-8 text-center text-sm text-muted">
                        No usable coverage report for this project.
                    </p>
                </DBox>

                <DBox
                    v-else-if="tab === 'deps'"
                    title="Outdated dependencies"
                    :meta="`pnpm outdated · collected ${depsAge} · advisories are workspace-wide`"
                    :to="`${BASE}/health?tab=deps`"
                    :count="outdated.length"
                >
                    <table v-if="outdated.length > 0" class="data-table">
                        <thead>
                            <tr>
                                <th>Package</th>
                                <th class="numeric">Current</th>
                                <th class="numeric hidden sm:table-cell">Wanted</th>
                                <th class="numeric">Latest</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in outdated" :key="item.name">
                                <td class="font-mono">
                                    {{ item.name }}
                                    <span v-if="item.isDeprecated" class="tone-bad"
                                        >deprecated</span
                                    >
                                </td>
                                <td class="numeric font-mono">{{ item.current }}</td>
                                <td class="numeric hidden font-mono sm:table-cell">
                                    {{ item.wanted }}
                                </td>
                                <td class="numeric font-mono text-highlighted">
                                    {{ item.latest }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-else class="px-4 py-8 text-center text-sm text-muted">
                        Everything is current.
                    </p>
                </DBox>

                <DBox
                    v-else-if="tab === 'issues'"
                    title="Open issues"
                    :meta="issuesRead ? `GitHub · labelled ${area}` : 'Reading GitHub…'"
                    :count="issuesRead ? projectIssues.length : '—'"
                >
                    <p
                        v-if="projectIssues.length === 0"
                        class="px-4 py-8 text-center text-sm text-muted"
                    >
                        {{
                            issuesRead
                                ? `No open issue is labelled ${area}.`
                                : "Reading open issues…"
                        }}
                    </p>
                    <ul v-else class="divide-y divide-default">
                        <li v-for="issue in projectIssues" :key="issue.number">
                            <a
                                :href="issue.url"
                                target="_blank"
                                class="flex items-baseline gap-3 px-4 py-2 hover:bg-elevated"
                            >
                                <span class="w-14 shrink-0 font-mono text-xs text-muted">
                                    #{{ issue.number }}
                                </span>
                                <span class="min-w-0 flex-1 truncate text-sm text-highlighted">
                                    {{ issue.title }}
                                </span>
                                <span class="shrink-0 font-mono text-xs text-muted">{{
                                    issue.age
                                }}</span>
                            </a>
                        </li>
                    </ul>
                </DBox>

                <DBox
                    v-else
                    title="Workflows"
                    :meta="`Running in ${folder}`"
                    :count="workflowCards.length"
                    to="/workflows"
                >
                    <p
                        v-if="workflowCards.length === 0"
                        class="px-4 py-8 text-center text-sm text-muted"
                    >
                        No workflow runs in this project.
                    </p>
                    <ul v-else class="divide-y divide-default">
                        <li v-for="card in workflowCards" :key="card.id">
                            <NuxtLink
                                :to="`/workflows/${card.id}`"
                                class="flex flex-col gap-2 px-4 py-3 hover:bg-elevated"
                            >
                                <div class="flex items-baseline justify-between gap-3">
                                    <span class="truncate text-sm font-medium text-highlighted">
                                        {{ card.title }}
                                    </span>
                                    <span data-figure class="text-xl leading-none text-highlighted">
                                        {{ card.percent }}<span class="text-sm text-muted">%</span>
                                    </span>
                                </div>
                                <DSplit
                                    :parts="[
                                        { label: 'done', value: card.done, tone: 'ink' },
                                        { label: 'to go', value: card.left, tone: 'soft' },
                                    ]"
                                />
                            </NuxtLink>
                        </li>
                    </ul>
                </DBox>
            </div>
        </div>
    </DShell>
</template>

<script setup lang="ts">
import { projectCard } from "#layers/workflows/shared/workflows.ts";
import { BASE, folderOf, kindIcons, projectPath } from "~/lab/idea/e/apps";
import DBox from "~/lab/idea/e/DBox.vue";
import DShell from "~/lab/idea/e/DShell.vue";
import DSplit from "~/lab/idea/e/DSplit.vue";
import { shortAge } from "~/lab/idea/e/format";

definePageMeta({ layout: false });

const TABS = [
    { id: "readme", label: "README" },
    { id: "coverage", label: "Coverage" },
    { id: "deps", label: "Dependencies" },
    { id: "issues", label: "Issues" },
    { id: "workflow", label: "Workflows" },
] as const;

const route = useRoute();
const folder = computed(() => String(route.params.name));
const tab = computed(() =>
    TABS.some((item) => item.id === route.query.tab) ? String(route.query.tab) : "readme",
);

const projects = projectsArtifact();
const metrics = metricsArtifact();
const coverageSnapshot = coverageArtifact();
const deps = depsArtifact();

const nodes = computed(() => projects?.projects ?? []);
const project = computed(
    () => nodes.value.find((node) => folderOf(node.root) === folder.value) ?? null,
);
const metric = computed(() => metrics?.projects.find((item) => item.root === project.value?.root));
const coverage = computed(() =>
    coverageSnapshot?.projects.find((item) => item.root === project.value?.root),
);
const coverageAge = computed(() => relativeTime(coverageSnapshot?.generatedAt));
const depsAge = computed(() => relativeTime(deps?.generatedAt));

const { data: readme } = await useAsyncData(
    () => `lab-e-readme-${folder.value}`,
    () =>
        project.value
            ? queryCollection("docs").path(`/${project.value.root.toLowerCase()}/readme`).first()
            : Promise.resolve(null),
    { watch: [folder] },
);

const outdated = computed(
    () =>
        deps?.outdated?.filter((item) => item.dependents.includes(project.value?.root ?? "")) ?? [],
);

const { data: read } = useIssues();
const mounted = ref(false);
onMounted(() => (mounted.value = true));
const issuesRead = computed(() => mounted.value && Boolean(read.value.fetchedAt));

const AREA_PREFIX = {
    apps: "app",
    packages: "package",
    infrastructure: "infra",
} as const satisfies Record<string, string>;

const area = computed(() => {
    const kind = project.value?.root.split("/")[0] ?? "";
    const prefix = kind in AREA_PREFIX ? AREA_PREFIX[kind as keyof typeof AREA_PREFIX] : "infra";

    return `${prefix}:${folder.value}`;
});

const projectIssues = computed(() =>
    mounted.value
        ? read.value.issues
              .filter((issue) => issue.labels.includes(area.value))
              .map((issue) => ({ ...issue, age: shortAge(issue.updatedAt) }))
        : [],
);

const { data: workflows } = await useWorkflows();
const workflowCards = computed(() =>
    workflows.value.projects
        .filter((view) => view.project.area === folder.value)
        .map((view) => ({
            ...projectCard(view),
            done: view.progress.done,
            left: view.progress.total - view.progress.done,
        })),
);

const page = computed(() => `${BASE}/catalog/${folder.value}`);

const coveragePct = computed(() => coverage.value?.lines?.pct ?? null);

const counts = computed<Partial<Record<string, number | string>>>(() => ({
    coverage: coveragePct.value === null ? undefined : `${coveragePct.value}%`,
    deps: outdated.value.length,
    workflow: workflowCards.value.length,
    ...(issuesRead.value && { issues: projectIssues.value.length }),
}));

const tabs = computed(() =>
    TABS.map((item) => ({
        label: item.label,
        to: item.id === "readme" ? page.value : `${page.value}?tab=${item.id}`,
        active: item.id === tab.value,
        count: counts.value[item.id],
    })),
);

const facts = computed((): { label: string; value: string; class: string; pct?: number }[] => [
    { label: "Version", value: metric.value?.currentVersion ?? "—", class: "" },
    {
        label: "Unreleased",
        value: metric.value?.unreleasedCommits ? `+${metric.value.unreleasedCommits}` : "—",
        class: "",
    },
    { label: "Commits, 2 wk", value: String(metric.value?.commitsLastTwoWeeks ?? "—"), class: "" },
    { label: "Specs", value: String(metric.value?.specs ?? "—"), class: "" },
    {
        label: "Lines covered",
        value: coveragePct.value === null ? "—" : `${coveragePct.value}%`,
        class: toneClass(coverageTone(coveragePct.value)),
        ...(coveragePct.value !== null && { pct: coveragePct.value }),
    },
    { label: "Changelog", value: metric.value?.hasChangelog ? "yes" : "no", class: "" },
]);

const coverageRows = computed(() =>
    (["lines", "statements", "functions", "branches"] as const).flatMap((key) => {
        const value = coverage.value?.[key];

        return value ? [{ label: key, ...value, tone: toneClass(coverageTone(value.pct)) }] : [];
    }),
);

const byName = computed(() => new Map(nodes.value.map((node) => [node.name, node.root])));
const toLink = (name: string) => ({ name, to: projectPath(byName.value.get(name) ?? name) });

const links = computed(() => [
    { title: "Depends on", items: [...new Set(project.value?.dependsOn ?? [])].map(toLink) },
    { title: "Used by", items: [...new Set(project.value?.dependedOnBy ?? [])].map(toLink) },
]);

const sections = computed(() => {
    const kind = project.value?.root.split("/")[0] ?? "";
    const coverageByRoot = new Map(
        (metrics?.projects ?? []).map((item) => [item.root, item.coverageLinesPct]),
    );

    return nodes.value
        .filter((node) => node.root.startsWith(`${kind}/`))
        .toSorted((a, b) => a.root.localeCompare(b.root))
        .map((node) => {
            const pct = coverageByRoot.get(node.root) ?? null;

            return {
                label: folderOf(node.root),
                icon: kindIcons[kind] ?? "i-lucide-box",
                to: projectPath(node.root),
                value: pct === null ? "—" : `${Math.round(pct)}%`,
                tone: coverageTone(pct),
                active: node.root === project.value?.root,
            };
        });
});
</script>
