<template>
    <DShell app="home" page="Home">
        <template #actions>
            <UButton
                :label="editing ? 'Done' : 'Customize'"
                :icon="editing ? 'i-lucide-check' : 'i-lucide-layout-grid'"
                size="sm"
                :variant="editing ? 'solid' : 'outline'"
                color="neutral"
                @click="editing = !editing"
            />
        </template>

        <DashboardGrid
            v-model:editing="editing"
            :widgets="WIDGETS"
            :empty="emptyWidgets"
            storage-key="lab-e-home-layout"
        >
            <template #queue>
                <DBox
                    v-model:filter="kind"
                    title="Work queue"
                    meta="What's open across issues, decisions, audits, releases and docs"
                    :count="current.length"
                    :filters
                    :all="allLink"
                >
                    <p v-if="current.length === 0" class="px-4 py-8 text-center text-sm text-muted">
                        {{ emptyText }}
                    </p>
                    <ul v-else class="divide-y divide-default">
                        <li v-for="row in shown" :key="row.key">
                            <component
                                :is="row.external ? 'a' : NuxtLink"
                                :href="row.external ? row.to : undefined"
                                :to="row.external ? undefined : row.to"
                                :target="row.external ? '_blank' : undefined"
                                class="flex items-baseline gap-3 px-4 py-2 hover:bg-elevated"
                            >
                                <span class="w-18 shrink-0 truncate font-mono text-xs text-muted">
                                    {{ row.id }}
                                </span>
                                <span class="min-w-0 flex-1">
                                    <span class="block truncate text-sm text-highlighted">
                                        {{ row.title }}
                                    </span>
                                    <span
                                        class="block truncate font-mono text-xs text-muted sm:hidden"
                                    >
                                        {{ row.meta }}
                                    </span>
                                </span>
                                <span
                                    class="hidden max-w-60 shrink-0 truncate font-mono text-xs text-muted sm:block"
                                >
                                    {{ row.meta }}
                                </span>
                            </component>
                        </li>
                    </ul>
                </DBox>
            </template>

            <template #health>
                <DBox
                    title="Health"
                    :meta="`Snapshot collected ${collectedAge}`"
                    :to="`${BASE}/health`"
                >
                    <dl class="divide-y divide-default">
                        <div v-for="line in healthLines" :key="line.label" class="px-4 py-3">
                            <NuxtLink :to="line.to" class="group flex flex-col gap-2">
                                <div class="flex items-baseline justify-between gap-3">
                                    <dt class="text-sm text-toned group-hover:text-highlighted">
                                        {{ line.label }}
                                    </dt>
                                    <dd
                                        data-figure
                                        class="text-xl leading-none"
                                        :class="line.class || 'text-highlighted'"
                                    >
                                        {{ line.value }}
                                    </dd>
                                </div>
                                <DSplit :parts="line.parts" :legend="line.legend" />
                                <p v-if="line.note" class="text-xs text-muted">{{ line.note }}</p>
                            </NuxtLink>
                        </div>
                    </dl>
                </DBox>
            </template>

            <template #workflows>
                <DBox
                    title="Workflows"
                    meta="Projects working through their map"
                    :count="activeWorkflows.length"
                    to="/workflows"
                    :all="{ label: 'New workflow', to: '/workflows/new' }"
                >
                    <p
                        v-if="activeWorkflows.length === 0"
                        class="px-4 py-8 text-center text-sm text-muted"
                    >
                        No workflow is running.
                    </p>
                    <ul v-else class="divide-y divide-default">
                        <li v-for="card in workflowCards" :key="card.id">
                            <NuxtLink
                                :to="`/workflows/${card.id}`"
                                class="flex flex-col gap-2 px-4 py-3 hover:bg-elevated"
                            >
                                <div class="flex items-baseline justify-between gap-3">
                                    <span class="min-w-0">
                                        <span
                                            class="block truncate text-sm font-medium text-highlighted"
                                        >
                                            {{ card.title }}
                                        </span>
                                        <span class="block truncate text-xs text-muted">
                                            {{ card.templateTitle }}
                                        </span>
                                    </span>
                                    <span
                                        data-figure
                                        class="shrink-0 text-xl leading-none text-highlighted"
                                    >
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
            </template>

            <template #activity>
                <DBox
                    title="Tooling runs per day"
                    :meta="`Usage log · collected ${usageAge}`"
                    :to="`${BASE}/health?tab=tooling`"
                >
                    <div class="px-4 pt-5 pb-4">
                        <DDailyChart :days :values="runsPerDay" unit="runs" end-label="last day" />
                    </div>
                </DBox>
            </template>
        </DashboardGrid>
    </DShell>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { countAll, sortAudits } from "#layers/audits/shared/auditReports.ts";
import { countByStatus, sortDecisions } from "#layers/decisions/shared/decisionReports.ts";
import { toCollectionPath } from "#layers/docs/shared/docPages.ts";
import { sortIssues } from "#layers/github/app/utils/issues.ts";
import { dailyTotals, scriptRows, shownDays, sumDays } from "#layers/telemetry/shared/usageView.ts";
import { activeProjects, projectCard } from "#layers/workflows/shared/workflows.ts";
import { BASE, projectPath } from "~/lab/idea/e/apps";
import DBox from "~/lab/idea/e/DBox.vue";
import DDailyChart from "~/lab/idea/e/DDailyChart.vue";
import DShell from "~/lab/idea/e/DShell.vue";
import DSplit, { type SplitPart } from "~/lab/idea/e/DSplit.vue";
import { shortAge } from "~/lab/idea/e/format";

definePageMeta({ layout: false });

const WIDGETS: WidgetDefinition[] = [
    { id: "queue", label: "Work queue", icon: "i-lucide-list-todo", size: "wide" },
    { id: "health", label: "Health", icon: "i-lucide-activity", size: "medium" },
    { id: "workflows", label: "Workflows", icon: "i-lucide-workflow", size: "medium" },
    { id: "activity", label: "Tooling runs", icon: "i-lucide-chart-column", size: "wide" },
];

const QUEUE_ROWS = 8;

type Kind = "all" | "issues" | "decisions" | "audits" | "releases" | "attention";

interface QueueRow {
    key: string;
    kind: Exclude<Kind, "all">;
    id: string;
    title: string;
    meta: string;
    to: string;
    external?: boolean;
}

const editing = ref(false);
const kind = ref<string>("all");

const metricsSnapshot = metricsArtifact();
const docsSnapshot = docsArtifact();
const coverage = coverageArtifact();
const deps = depsArtifact();
const usage = usageArtifact();

const { data: read } = useIssues();
const mounted = ref(false);
onMounted(() => (mounted.value = true));
const issues = computed(() =>
    mounted.value ? read.value : { fetchedAt: "", error: null, issues: [] },
);

const decisionReports = useDecisionReports();
const auditReports = useAuditReports();

const issueRows = computed((): QueueRow[] =>
    sortIssues(issues.value.issues).map((issue) => ({
        key: `issue-${issue.number}`,
        kind: "issues",
        id: `#${issue.number}`,
        title: issue.title,
        meta: shortAge(issue.updatedAt),
        to: issue.url,
        external: true,
    })),
);

const decisionRows = computed((): QueueRow[] =>
    sortDecisions(decisionReports.value, "newest")
        .filter((report) => report.status === "to-implement" && report.decision !== "superseded")
        .map((report) => ({
            key: `decision-${report.id}`,
            kind: "decisions",
            id: report.number,
            title: report.title,
            meta: "to implement",
            to: `/decisions/${report.id}`,
        })),
);

const auditRows = computed((): QueueRow[] =>
    sortAudits(auditReports.value, "most-open")
        .filter((report) => report.state !== "closed")
        .map((report) => ({
            key: `audit-${report.id}`,
            kind: "audits",
            id: report.date.slice(5),
            title: report.title,
            meta: `${report.counts.open} of ${report.findings.length} open`,
            to: `/audits/${report.id}`,
        })),
);

const releaseRows = computed((): QueueRow[] =>
    (metricsSnapshot?.projects ?? [])
        .filter((project) => (project.unreleasedCommits ?? 0) > 0)
        .toSorted((a, b) => (b.unreleasedCommits ?? 0) - (a.unreleasedCommits ?? 0))
        .map((project) => ({
            key: `release-${project.root}`,
            kind: "releases",
            id: `+${project.unreleasedCommits}`,
            title: project.name,
            meta: `${project.currentVersion ?? "unversioned"} · unreleased`,
            to: projectPath(project.root),
        })),
);

const attentionRows = computed((): QueueRow[] => [
    ...(metricsSnapshot?.invariantFindings ?? []).map((finding) => ({
        key: `finding-${finding.id}`,
        kind: "attention" as const,
        id: "invariant",
        title: finding.title,
        meta: finding.detail,
        to: `${BASE}/health`,
    })),
    ...(docsSnapshot?.pages ?? [])
        .filter((page) => page.brokenLinks.length > 0)
        .map((page) => ({
            key: `docs-${page.path}`,
            kind: "attention" as const,
            id: "link",
            title: page.path,
            meta: `${page.brokenLinks.length} broken`,
            to: `/wiki${toCollectionPath(page.path)}`,
        })),
]);

const byKind = computed(() => ({
    issues: issueRows.value,
    decisions: decisionRows.value,
    audits: auditRows.value,
    releases: releaseRows.value,
    attention: attentionRows.value,
}));

const all = computed(() => Object.values(byKind.value).flat());

const current = computed(() =>
    kind.value === "all" ? all.value : (byKind.value[kind.value as Exclude<Kind, "all">] ?? []),
);

const shown = computed(() => current.value.slice(0, QUEUE_ROWS));

const filters = computed(() => [
    { id: "all", label: "All", count: all.value.length },
    {
        id: "issues",
        label: "Issues",
        count: issues.value.fetchedAt ? issueRows.value.length : undefined,
    },
    { id: "decisions", label: "Decisions", count: decisionRows.value.length },
    { id: "audits", label: "Audits", count: auditRows.value.length },
    { id: "releases", label: "Releases", count: releaseRows.value.length },
    { id: "attention", label: "Attention", count: attentionRows.value.length },
]);

const ALL_LINKS = {
    all: null,
    issues: "/issues",
    decisions: "/decisions",
    audits: "/audits",
    releases: `${BASE}/catalog`,
    attention: null,
} as const satisfies Record<Kind, string | null>;

const allLink = computed(() => {
    const to = ALL_LINKS[kind.value as Kind];

    return current.value.length > QUEUE_ROWS && to
        ? { label: `All ${current.value.length}`, to }
        : null;
});

const emptyText = computed(() => {
    if (kind.value === "issues" && issues.value.error)
        return "GitHub could not be read from this browser.";

    return "Nothing open here.";
});

const decisionCounts = computed(() => countByStatus(decisionReports.value));
const auditTotals = computed(() => countAll(auditReports.value));

const collectedAge = computed(() => relativeTime(metricsSnapshot?.generatedAt));
const usageAge = computed(() => relativeTime(usage?.generatedAt));

const scripts = computed(() => (usage ? scriptRows(usage) : []));
const days = computed(() => (usage ? shownDays(usage) : []));
const runsPerDay = computed(() => dailyTotals(scripts.value).map((day) => day.runs));

const healthLines = computed(() => {
    const lines = coverage?.totals?.lines ?? null;
    const counts = deps?.vulnerabilities ?? null;
    const tooling = sumDays(scripts.value);
    const docs = docsSnapshot ?? null;

    return [
        {
            label: "Line coverage",
            value: lines === null ? "—" : `${lines}%`,
            class: toneClass(coverageTone(lines)),
            to: `${BASE}/health?tab=coverage`,
            legend: false,
            parts: [
                { label: "covered", value: lines ?? 0, tone: "ink" },
                { label: "uncovered", value: 100 - (lines ?? 0), tone: "soft" },
            ] satisfies SplitPart[],
        },
        {
            label: "Advisories",
            value: counts ? String(deps?.advisories.length ?? 0) : "—",
            class: counts?.critical || counts?.high ? "tone-bad" : "",
            to: `${BASE}/health?tab=deps`,
            legend: true,
            parts: [
                { label: "critical", value: counts?.critical ?? 0, tone: "bad" },
                { label: "high", value: counts?.high ?? 0, tone: "bad" },
                { label: "moderate", value: counts?.moderate ?? 0, tone: "warn" },
                { label: "low", value: counts?.low ?? 0, tone: "soft" },
            ] satisfies SplitPart[],
        },
        {
            label: "Tooling runs failed",
            value: tooling.runs ? `${percentOf(tooling.failures, tooling.runs)}%` : "—",
            class: tooling.runs && tooling.failures / tooling.runs >= 0.25 ? "tone-bad" : "",
            to: `${BASE}/health?tab=tooling`,
            legend: true,
            parts: [
                { label: "passed", value: tooling.runs - tooling.failures, tone: "ink" },
                { label: "failed", value: tooling.failures, tone: "bad" },
            ] satisfies SplitPart[],
        },
        {
            label: "Decisions implemented",
            value: `${decisionCounts.value.implemented}`,
            class: "",
            to: "/decisions",
            legend: true,
            parts: [
                { label: "implemented", value: decisionCounts.value.implemented, tone: "ink" },
                {
                    label: "to implement",
                    value: decisionCounts.value["to-implement"],
                    tone: "soft",
                },
            ] satisfies SplitPart[],
        },
        {
            label: "Audit findings open",
            value: String(auditTotals.value.findings.open),
            class: "",
            to: "/audits",
            legend: false,
            parts: [
                { label: "open", value: auditTotals.value.findings.open, tone: "warn" },
                { label: "fixed", value: auditTotals.value.findings.fixed ?? 0, tone: "soft" },
            ] satisfies SplitPart[],
        },
        {
            label: "Doc pages",
            value: docs ? String(docs.pages.length) : "—",
            class: docs?.brokenLinkCount ? "tone-bad" : "",
            to: "/wiki",
            legend: false,
            note: docs?.brokenLinkCount
                ? `${docs.brokenLinkCount} broken links`
                : "No broken links",
            parts: [] satisfies SplitPart[],
        },
    ];
});

const emptyWidgets = computed(() => (days.value.length === 0 ? ["activity"] : []));

const { data: workflows } = await useWorkflows();
const activeWorkflows = computed(() => activeProjects(workflows.value.projects));
const workflowCards = computed(() =>
    activeWorkflows.value.map((view) => ({
        ...projectCard(view),
        done: view.progress.done,
        left: view.progress.total - view.progress.done,
    })),
);
</script>
