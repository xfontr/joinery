<template>
    <UDashboardPanel id="coverage">
        <template #header>
            <PageHeader title="Coverage">
                <template #intro>
                    <PageFacts :provenance :facts />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <WidgetPanel title="Coverage by project" meta="Sorted by line coverage, lowest first">
                <p v-if="rows.length === 0" class="px-4 py-8 text-center text-sm text-muted">
                    Not collected. Run <code class="font-mono">pnpm test:coverage</code>, then
                    collect.
                </p>
                <div v-else data-scroll-x class="overflow-x-auto">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th
                                    v-for="metric in METRICS"
                                    :key="metric"
                                    class="numeric first-letter:uppercase"
                                >
                                    {{ metric }}
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
                            <tr v-for="row in rows" :key="row.root">
                                <td>
                                    <NuxtLink
                                        :to="row.to"
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
                                <!-- Absent is its own state. Not 0%, and certainly not 100%. -->
                                <td v-else colspan="5" class="numeric font-mono text-dimmed">
                                    not collected
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="border-t border-default px-4 py-3 text-xs text-muted">
                    The workspace figure is weighted by size, not averaged across projects — an
                    average lets one large well-tested package hide a small untested one.
                </p>
            </WidgetPanel>

            <WidgetPanel
                title="Line-by-line report"
                meta="The merged report pnpm test:coverage renders, copied in by the collector"
            >
                <template v-if="coverage?.report">
                    <div class="flex justify-end border-b border-default px-4 py-2">
                        <UButton
                            :to="coverageEmbed"
                            target="_blank"
                            external
                            label="Open full"
                            icon="i-lucide-external-link"
                            color="neutral"
                            variant="ghost"
                            size="xs"
                        />
                    </div>
                    <iframe
                        :src="coverageEmbed"
                        class="embedded-report h-160"
                        title="Coverage report"
                    />
                </template>
                <p v-else class="px-4 py-8 text-center text-sm text-muted">
                    No HTML report copied in. Run
                    <code class="font-mono">pnpm test:coverage</code> from the workspace root, then
                    <code class="font-mono">pnpm exec nx collect @monorepo/developer-portal</code>.
                </p>
            </WidgetPanel>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import type { PageFact } from "~/components/PageFacts.vue";

const METRICS = ["lines", "statements", "functions", "branches"] as const;

type Metric = (typeof METRICS)[number];

const { data: snapshot } = await useSnapshot("coverage");

const coverage = computed(() => snapshot.value?.coverage ?? null);
const totals = computed(() => coverage.value?.totals ?? null);

const toCell = (key: Metric, pct: number | null | undefined) => ({
    key,
    pct: pct ?? 0,
    label: dash(pct, "%"),
    tone: toneClass(coverageTone(pct ?? null)),
});

const rows = computed(() =>
    (coverage.value?.projects ?? [])
        .map((project) => ({
            ...project,
            to: `/projects/${folderOf(project.root)}?tab=coverage`,
            cells: METRICS.map((key) => toCell(key, project[key]?.pct)),
        }))
        .toSorted((a, b) => (a.lines?.pct ?? 101) - (b.lines?.pct ?? 101)),
);

const totalCells = computed(() => METRICS.map((key) => toCell(key, totals.value?.[key])));
const totalFiles = computed(() => rows.value.reduce((sum, row) => sum + (row.files ?? 0), 0));

const provenance = computed(() => {
    const collected = rows.value.filter((row) => row.collected).length;

    return `Vitest coverage · ${collected} of ${rows.value.length} projects · collected ${relativeTime(coverage.value?.generatedAt)}`;
});

const facts = computed((): PageFact[] =>
    METRICS.map((key) => ({
        label: key,
        value: dash(totals.value?.[key], "%"),
        class: toneClass(coverageTone(totals.value?.[key] ?? null)),
    })),
);

const coverageEmbed = embedUrl("/embed/coverage/index.html");
</script>
