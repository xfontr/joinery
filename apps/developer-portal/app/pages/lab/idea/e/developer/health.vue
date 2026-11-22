<template>
    <DShell app="health" :page="current.label" :sections>
        <template #intro>
            <div class="mt-2 px-4 md:px-6">
                <p class="text-xs text-muted">{{ provenance }}</p>
                <dl class="mt-4 flex flex-wrap gap-x-8 gap-y-4">
                    <div v-for="fact in facts" :key="fact.label" class="flex flex-col gap-1">
                        <dt class="text-xs text-muted first-letter:uppercase">
                            <button
                                v-if="fact.series"
                                type="button"
                                class="border-b border-dashed border-current hover:text-highlighted"
                                :class="fact.series === series && 'border-solid text-highlighted'"
                                :aria-pressed="fact.series === series"
                                @click="series = fact.series"
                            >
                                {{ fact.label }}
                            </button>
                            <template v-else>{{ fact.label }}</template>
                        </dt>
                        <dd
                            data-figure
                            class="text-3xl leading-none text-highlighted"
                            :class="fact.class"
                        >
                            {{ fact.value }}
                        </dd>
                    </div>
                </dl>
            </div>
        </template>

        <DBox
            v-if="tab === 'coverage'"
            title="Coverage by project"
            :meta="`Sorted by line coverage, lowest first`"
            to="/coverage"
        >
            <div class="overflow-x-auto">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th v-for="key in METRICS" :key class="numeric first-letter:uppercase">
                                {{ key }}
                            </th>
                            <th class="numeric hidden sm:table-cell">Files</th>
                        </tr>
                        <tr class="bg-default">
                            <td class="font-medium text-highlighted">Workspace</td>
                            <td
                                v-for="cell in totalCells"
                                :key="cell.key"
                                data-meter
                                :style="{ '--pct': cell.pct }"
                                class="numeric font-mono font-medium"
                                :class="cell.tone"
                            >
                                {{ cell.label }}
                            </td>
                            <td class="numeric hidden font-mono font-medium sm:table-cell">
                                {{ totalFiles }}
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in coverageRows" :key="row.root">
                            <td>
                                <NuxtLink
                                    :to="`${projectPath(row.root)}?tab=coverage`"
                                    class="font-mono text-highlighted hover:underline"
                                >
                                    {{ row.name }}
                                </NuxtLink>
                            </td>
                            <template v-if="row.collected">
                                <td
                                    v-for="cell in row.cells"
                                    :key="cell.key"
                                    data-meter
                                    :style="{ '--pct': cell.pct }"
                                    class="numeric font-mono"
                                    :class="cell.tone"
                                >
                                    {{ cell.label }}
                                </td>
                                <td class="numeric hidden font-mono sm:table-cell">
                                    {{ row.files }}
                                </td>
                            </template>
                            <td v-else colspan="5" class="numeric font-mono text-dimmed">
                                not collected
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </DBox>

        <div v-else-if="tab === 'deps'" class="grid gap-6">
            <DBox title="Advisories" :count="advisories.length" to="/deps">
                <div class="border-b border-default px-4 py-3">
                    <DSplit :parts="severityParts" />
                </div>
                <p v-if="advisories.length === 0" class="px-4 py-8 text-center text-sm text-muted">
                    No known advisory.
                </p>
                <div v-else class="overflow-x-auto">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Severity</th>
                                <th>Package</th>
                                <th class="hidden md:table-cell">Advisory</th>
                                <th class="numeric">Patched</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in advisoryRows" :key="item.id">
                                <td class="font-mono text-xs" :class="item.tone">
                                    {{ item.severity }}
                                </td>
                                <td>
                                    <span class="block font-mono">{{ item.moduleName }}</span>
                                    <a
                                        :href="item.url"
                                        target="_blank"
                                        class="block text-xs text-muted hover:underline md:hidden"
                                    >
                                        {{ item.title }}
                                    </a>
                                </td>
                                <td class="hidden md:table-cell">
                                    <a :href="item.url" target="_blank" class="hover:underline">
                                        {{ item.title }}
                                    </a>
                                </td>
                                <td class="numeric font-mono">{{ item.patchedVersions }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </DBox>

            <DBox title="Outdated" :count="outdated.length">
                <div class="overflow-x-auto">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Package</th>
                                <th class="numeric">Current</th>
                                <th class="numeric hidden sm:table-cell">Wanted</th>
                                <th class="numeric">Latest</th>
                                <th class="numeric hidden sm:table-cell">Projects</th>
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
                                <td class="numeric hidden font-mono sm:table-cell">
                                    {{ item.dependents.length }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </DBox>
        </div>

        <div v-else class="grid gap-6">
            <DBox v-model:filter="chartView" :title="chart.title" :filters="VIEWS">
                <div v-if="chartView === 'chart'" class="px-4 pt-5 pb-4">
                    <DDailyChart
                        :days
                        :values="chart.values"
                        :unit="chart.unit"
                        end-label="last day"
                    />
                    <p class="mt-4 text-sm text-toned">{{ chart.reading }}</p>
                </div>
                <div v-else class="max-h-96 overflow-y-auto">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th class="numeric">Runs</th>
                                <th class="numeric">By agents</th>
                                <th class="numeric">Failed</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in dayRows" :key="row.day">
                                <td class="font-mono">{{ row.label }}</td>
                                <td class="numeric font-mono">{{ row.runs }}</td>
                                <td class="numeric font-mono">{{ row.agent }}</td>
                                <td
                                    class="numeric font-mono"
                                    :class="row.failures ? 'tone-bad' : ''"
                                >
                                    {{ row.failures }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </DBox>

            <DBox title="Repo scripts" :count="scripts.length" to="/telemetry">
                <div class="overflow-x-auto">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Script</th>
                                <th class="numeric">Runs</th>
                                <th class="numeric hidden sm:table-cell">By agents</th>
                                <th class="numeric">Failed</th>
                                <th class="numeric">Last run</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in scripts" :key="row.name">
                                <td class="font-mono text-highlighted">{{ row.name }}</td>
                                <td class="numeric font-mono">{{ row.runs }}</td>
                                <td class="numeric hidden font-mono sm:table-cell">
                                    {{ row.agentShare }}
                                </td>
                                <td
                                    class="numeric font-mono"
                                    :class="row.failing ? 'tone-bad' : ''"
                                >
                                    {{ row.failShare }}
                                </td>
                                <td class="numeric font-mono text-muted" :title="row.lastExact">
                                    {{ row.lastShort }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </DBox>
        </div>
    </DShell>
</template>

<script setup lang="ts">
import { WINDOW_DAYS } from "#layers/telemetry/shared/usage.ts";
import { dailyTotals, scriptRows, shownDays, sumDays } from "#layers/telemetry/shared/usageView.ts";
import { BASE, healthTabs, projectPath } from "~/lab/idea/e/apps";
import DBox from "~/lab/idea/e/DBox.vue";
import DDailyChart from "~/lab/idea/e/DDailyChart.vue";
import DShell from "~/lab/idea/e/DShell.vue";
import DSplit, { type SplitPart } from "~/lab/idea/e/DSplit.vue";
import { shortAge } from "~/lab/idea/e/format";

definePageMeta({ layout: false });

const METRICS = ["lines", "statements", "functions", "branches"] as const;
const SEVERITIES = ["critical", "high", "moderate", "low"] as const;

const VIEWS = [
    { id: "chart", label: "Chart" },
    { id: "table", label: "Table" },
];

const route = useRoute();
const current = computed(
    () => healthTabs.find((item) => item.id === route.query.tab) ?? healthTabs[0],
);
const tab = computed(() => current.value.id);

const coverage = coverageArtifact();
const deps = depsArtifact();
const usage = usageArtifact();

const percent = (value: number | null | undefined): string =>
    value === null || value === undefined ? "—" : `${value}%`;

const cellsOf = (
    source: Partial<Record<(typeof METRICS)[number], { pct: number } | null>> | null,
) =>
    METRICS.map((key) => {
        const pct = source?.[key]?.pct ?? null;

        return {
            key,
            pct: pct ?? 0,
            label: percent(pct),
            tone: toneClass(coverageTone(pct)),
        };
    });

const coverageRows = computed(() =>
    (coverage?.projects ?? [])
        .map((row) => ({ ...row, cells: cellsOf(row) }))
        .toSorted((a, b) => (a.lines?.pct ?? 101) - (b.lines?.pct ?? 101)),
);
const collected = computed(() => coverageRows.value.filter((row) => row.collected).length);
const totals = computed(() => coverage?.totals ?? null);
const totalCells = computed(() =>
    METRICS.map((key) => {
        const pct = totals.value?.[key] ?? null;

        return { key, pct: pct ?? 0, label: percent(pct), tone: toneClass(coverageTone(pct)) };
    }),
);
const totalFiles = computed(() =>
    coverageRows.value.reduce((sum, row) => sum + (row.files ?? 0), 0),
);

const counts = computed(() => deps?.vulnerabilities ?? null);
const advisories = computed(() => deps?.advisories ?? []);
const advisoryRows = computed(() =>
    advisories.value.map((item) => ({ ...item, tone: toneClass(severityTone(item.severity)) })),
);
const outdated = computed(() => deps?.outdated ?? []);

const severityParts = computed((): SplitPart[] => [
    { label: "critical", value: counts.value?.critical ?? 0, tone: "bad" },
    { label: "high", value: counts.value?.high ?? 0, tone: "bad" },
    { label: "moderate", value: counts.value?.moderate ?? 0, tone: "warn" },
    { label: "low", value: counts.value?.low ?? 0, tone: "soft" },
]);

const scripts = computed(() =>
    (usage ? scriptRows(usage).toSorted((a, b) => b.runs - a.runs) : []).map((row) => ({
        ...row,
        agentShare: row.runs ? `${percentOf(row.agent, row.runs)}%` : "—",
        failShare: row.runs ? `${percentOf(row.failures, row.runs)}%` : "—",
        lastShort: shortAge(row.last),
        lastExact: row.last ? relativeTime(row.last) : "",
    })),
);

type Series = "runs" | "agent" | "failures";

const SERIES = {
    runs: { title: "Runs per day", unit: "runs" },
    agent: { title: "Agent runs per day", unit: "agent runs" },
    failures: { title: "Failed runs per day", unit: "failed runs" },
} as const satisfies Record<Series, { title: string; unit: string }>;

const series = ref<Series>("runs");
const chartView = ref("chart");

const days = computed(() => (usage ? shownDays(usage) : []));
const daily = computed(() => dailyTotals(scripts.value));

const dayRows = computed(() =>
    days.value
        .map((day, index) => ({
            day,
            label: calendarDay(day),
            runs: daily.value[index]?.runs ?? 0,
            agent: daily.value[index]?.agent ?? 0,
            failures: daily.value[index]?.failures ?? 0,
        }))
        .toReversed(),
);

const chart = computed(() => {
    const { title, unit } = SERIES[series.value];
    const values = days.value.map((_, index) => daily.value[index]?.[series.value] ?? 0);
    const sum = values.reduce((total, value) => total + value, 0);
    const peak = Math.max(0, ...values);
    const peakDay = days.value[values.indexOf(peak)] ?? "";
    const average = values.length ? Math.round((sum / values.length) * 10) / 10 : 0;

    return {
        title,
        unit,
        values,
        reading:
            sum === 0
                ? `No ${unit} in the window.`
                : `${average} ${unit} a day on average; the busiest day was ${calendarDay(peakDay)}, with ${peak}.`,
    };
});

const provenance = computed(() => {
    if (tab.value === "coverage")
        return `Vitest coverage · ${collected.value} of ${coverageRows.value.length} projects · collected ${relativeTime(coverage?.generatedAt)}`;
    if (tab.value === "deps")
        return `pnpm audit and pnpm outdated · collected ${relativeTime(deps?.generatedAt)}`;

    return `Usage log · last ${WINDOW_DAYS} days · collected ${relativeTime(usage?.generatedAt)}`;
});

interface Fact {
    label: string;
    value: string;
    class: string;
    series?: Series;
}

const toolingSum = computed(() => sumDays(scripts.value));

const facts = computed((): Fact[] => {
    if (tab.value === "coverage")
        return METRICS.map((key) => ({
            label: key,
            value: percent(totals.value?.[key]),
            class: toneClass(coverageTone(totals.value?.[key])),
        }));

    if (tab.value === "deps")
        return [
            ...SEVERITIES.map((severity) => ({
                label: severity,
                value: counts.value ? String(counts.value[severity]) : "—",
                class: counts.value?.[severity] ? toneClass(severityTone(severity)) : "",
            })),
            { label: "Outdated", value: String(outdated.value.length), class: "" },
            {
                label: "Dependencies",
                value: String(deps?.totalDependencies ?? "—"),
                class: "",
            },
        ];

    const sum = toolingSum.value;

    return [
        { label: "Runs", value: String(sum.runs), class: "", series: "runs" },
        {
            label: "By agents",
            value: percent(percentOf(sum.agent, sum.runs)),
            class: "",
            series: "agent",
        },
        {
            label: "Failed",
            value: percent(percentOf(sum.failures, sum.runs)),
            class: scripts.value.some((row) => row.failing) ? "tone-bad" : "",
            series: "failures",
        },
        { label: "Scripts", value: String(scripts.value.length), class: "" },
        {
            label: "Never run",
            value: String(scripts.value.filter((row) => row.runs === 0).length),
            class: "",
        },
    ];
});

const sections = computed(() => {
    const lines = totals.value?.lines ?? null;
    const sum = toolingSum.value;

    return [
        {
            label: "Coverage",
            icon: "i-lucide-shield-check",
            to: `${BASE}/health?tab=coverage`,
            value: percent(lines),
            tone: coverageTone(lines),
            active: tab.value === "coverage",
        },
        {
            label: "Dependencies",
            icon: "i-lucide-git-fork",
            to: `${BASE}/health?tab=deps`,
            value: `${advisories.value.length} adv.`,
            tone:
                counts.value?.critical || counts.value?.high
                    ? ("bad" as const)
                    : ("neutral" as const),
            active: tab.value === "deps",
        },
        {
            label: "Tooling usage",
            icon: "i-lucide-terminal",
            to: `${BASE}/health?tab=tooling`,
            value: sum.runs ? `${percentOf(sum.failures, sum.runs)}% fail` : "—",
            tone:
                sum.runs && sum.failures / sum.runs >= 0.25
                    ? ("bad" as const)
                    : ("neutral" as const),
            active: tab.value === "tooling",
        },
    ];
});
</script>
