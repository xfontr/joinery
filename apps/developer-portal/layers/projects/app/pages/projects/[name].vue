<template>
    <UDashboardPanel id="project">
        <template #header>
            <PageHeader
                :title="project?.name ?? name"
                :crumbs="[{ label: 'projects', to: '/projects' }, { label: name }]"
                :tabs="project ? tabs : []"
            >
                <template #title>
                    <h1 class="truncate font-mono text-2xl font-semibold text-highlighted">
                        {{ project?.name ?? name }}
                    </h1>
                </template>
                <template v-if="readme?.description" #intro>
                    <p class="mt-2 max-w-3xl px-4 text-sm text-toned sm:px-6">
                        {{ readme.description }}
                    </p>
                </template>
            </PageHeader>
        </template>

        <template #body>
            <UAlert
                v-if="!project"
                color="neutral"
                variant="subtle"
                icon="i-lucide-box"
                title="No such project"
                :description="`No collected project lives in a folder called ${name}.`"
            />

            <div v-else class="grid items-start gap-6 lg:grid-cols-4">
                <aside class="order-first lg:sticky lg:top-0 lg:order-last">
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
                                    :class="fact.class || 'text-highlighted'"
                                    :data-meter="fact.pct !== undefined || undefined"
                                    :style="
                                        fact.pct === undefined ? undefined : { '--pct': fact.pct }
                                    "
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
                                <dd
                                    class="flex flex-wrap gap-x-3 font-mono text-xs text-highlighted"
                                >
                                    <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
                                </dd>
                            </div>
                        </dl>
                    </WidgetPanel>
                </aside>

                <div class="min-w-0 lg:col-span-3">
                    <article
                        v-if="tab === 'readme'"
                        data-prose
                        data-readme
                        class="overflow-x-auto border border-default bg-default px-6 py-5"
                    >
                        <ContentRenderer v-if="readme" :value="readme" />
                        <p v-else class="text-muted">This project has no README.</p>
                    </article>

                    <WidgetPanel
                        v-else-if="tab === 'coverage'"
                        title="Coverage"
                        :meta="
                            coverage
                                ? `Vitest · ${coverage.files} files · collected ${coverageAge}`
                                : 'Not collected'
                        "
                        to="/coverage"
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
                                <SplitBar
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
                    </WidgetPanel>

                    <WidgetPanel
                        v-else-if="tab === 'deps'"
                        title="Outdated dependencies"
                        :meta="`pnpm outdated · collected ${depsAge} · advisories are workspace-wide`"
                        to="/deps"
                        :count="outdated.length"
                    >
                        <div v-if="outdated.length > 0" data-scroll-x class="overflow-x-auto">
                            <table class="data-table">
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
                                            <span v-if="item.isDeprecated" class="tone-bad">
                                                deprecated
                                            </span>
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
                        </div>
                        <p v-else class="px-4 py-8 text-center text-sm text-muted">
                            Everything is current.
                        </p>
                    </WidgetPanel>

                    <WidgetPanel
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
                                    <span class="shrink-0 font-mono text-xs text-muted">
                                        {{ issue.age }}
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </WidgetPanel>

                    <WidgetPanel
                        v-else-if="extra"
                        :title="extra.label"
                        :meta="`Running in ${name}`"
                        :count="extra.items.length"
                        :to="extra.to"
                    >
                        <p
                            v-if="extra.items.length === 0"
                            class="px-4 py-8 text-center text-sm text-muted"
                        >
                            {{ extra.empty }}
                        </p>
                        <ul v-else class="divide-y divide-default">
                            <li v-for="row in extra.items" :key="row.id">
                                <NuxtLink
                                    :to="row.to"
                                    class="flex flex-col gap-2 px-4 py-3 hover:bg-elevated"
                                >
                                    <div class="flex items-baseline justify-between gap-3">
                                        <span class="truncate text-sm font-medium text-highlighted">
                                            {{ row.title }}
                                        </span>
                                        <span
                                            data-figure
                                            class="text-xl leading-none text-highlighted"
                                        >
                                            {{ row.percent
                                            }}<span class="text-sm text-muted">%</span>
                                        </span>
                                    </div>
                                    <SplitBar
                                        :parts="[
                                            { label: 'done', value: row.done, tone: 'ink' },
                                            { label: 'to go', value: row.left, tone: 'soft' },
                                        ]"
                                    />
                                </NuxtLink>
                            </li>
                        </ul>
                    </WidgetPanel>
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import type { PageTab } from "~/components/AppTabs.vue";
import type { ProjectTab, ProjectTabRow } from "~/utils/apps";

const BUILT_IN = [
    { id: "readme", label: "README" },
    { id: "coverage", label: "Coverage" },
    { id: "deps", label: "Dependencies" },
    { id: "issues", label: "Issues" },
];

const AREA_PREFIX: Record<string, string> = {
    apps: "app",
    packages: "package",
    infrastructure: "infra",
};

const { projectTabs = {} }: { projectTabs?: Record<string, ProjectTab | undefined> } =
    useAppConfig();
const registered = Object.entries(projectTabs).flatMap(([id, entry]) =>
    entry ? [{ id, ...entry }] : [],
);
const TABS = [...BUILT_IN, ...registered.map(({ id, label }) => ({ id, label }))];

const route = useRoute("projects-name");
const name = computed(() => String(route.params.name));
const tab = computed(() =>
    TABS.some((item) => item.id === route.query.tab) ? String(route.query.tab) : "readme",
);

const [{ projects, metricFor }, { data: coverageSnapshot }, { data: deps }] = await Promise.all([
    useCatalog(),
    useSnapshot("coverage"),
    useSnapshot("deps"),
]);

const project = computed(() =>
    projects.value.find((candidate) => folderOf(candidate.root) === name.value),
);
const metric = computed(() => (project.value ? metricFor(project.value) : undefined));

const { data: readme } = await useAsyncData(`project-readme-${name.value}`, () =>
    project.value
        ? queryCollection("docs").path(`/${project.value.root.toLowerCase()}/readme`).first()
        : Promise.resolve(null),
);

const coverage = computed(() =>
    coverageSnapshot.value?.coverage?.projects.find((item) => item.root === project.value?.root),
);
const coverageAge = computed(() => relativeTime(coverageSnapshot.value?.coverage?.generatedAt));
const coveragePct = computed(() => coverage.value?.lines?.pct ?? null);

const coverageRows = computed(() =>
    (["lines", "statements", "functions", "branches"] as const).flatMap((key) => {
        const value = coverage.value?.[key];

        return value ? [{ label: key, ...value, tone: toneClass(coverageTone(value.pct)) }] : [];
    }),
);

const depsAge = computed(() => relativeTime(deps.value?.deps?.generatedAt));
const outdated = computed(
    () =>
        deps.value?.deps?.outdated?.filter((item) =>
            item.dependents.includes(project.value?.root ?? ""),
        ) ?? [],
);

const extraRows = await Promise.all(
    registered.map(
        async (entry) =>
            (
                await useFetch<Record<string, ProjectTabRow[]>>(entry.rows, {
                    key: `project-tab-${entry.id}`,
                    default: () => ({}),
                })
            ).data,
    ),
);

const extras = computed(() =>
    registered.map((entry, index) => ({
        ...entry,
        items: extraRows[index]?.value[name.value] ?? [],
    })),
);
const extra = computed(() => extras.value.find((entry) => entry.id === tab.value) ?? null);

const { data: read } = useIssues();
const mounted = ref(false);
onMounted(() => (mounted.value = true));
const issuesRead = computed(() => mounted.value && Boolean(read.value.fetchedAt));

const area = computed(() => {
    const kind = project.value?.root.split("/")[0] ?? "";

    return `${AREA_PREFIX[kind] ?? "infra"}:${name.value}`;
});

const projectIssues = computed(() =>
    mounted.value
        ? read.value.issues
              .filter((issue) => issue.labels.includes(area.value))
              .map((issue) => ({ ...issue, age: shortAge(issue.updatedAt) }))
        : [],
);

const counts = computed<Partial<Record<string, number | string>>>(() => ({
    coverage: coveragePct.value === null ? undefined : `${coveragePct.value}%`,
    deps: outdated.value.length,
    ...(issuesRead.value && { issues: projectIssues.value.length }),
    ...Object.fromEntries(extras.value.map((entry) => [entry.id, entry.items.length])),
}));

const tabs = computed((): PageTab[] =>
    TABS.map((item) => ({
        label: item.label,
        to: item.id === "readme" ? route.path : `${route.path}?tab=${item.id}`,
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
    { label: "Commits, 2 wk", value: dash(metric.value?.commitsLastTwoWeeks), class: "" },
    { label: "Specs", value: dash(metric.value?.specs), class: "" },
    {
        label: "Lines covered",
        value: dash(coveragePct.value, "%"),
        class: toneClass(coverageTone(coveragePct.value)),
        ...(coveragePct.value !== null && { pct: coveragePct.value }),
    },
    { label: "Changelog", value: metric.value?.hasChangelog ? "yes" : "no", class: "" },
]);

const pageFor = (packageName: string): string => {
    const found = projects.value.find((candidate) => candidate.name === packageName);
    return found ? `/projects/${folderOf(found.root)}` : "/projects";
};

const relations = computed(() => [
    {
        label: "Depends on",
        items: [...new Set(project.value?.dependsOn ?? [])].map((item) => ({
            name: item,
            to: pageFor(item),
        })),
    },
    {
        label: "Used by",
        items: [...new Set(project.value?.dependedOnBy ?? [])].map((item) => ({
            name: item,
            to: pageFor(item),
        })),
    },
]);
</script>
