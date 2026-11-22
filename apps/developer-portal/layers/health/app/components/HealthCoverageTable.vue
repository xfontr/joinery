<template>
    <WidgetPanel :title="$t('healthCoverageTable.title')" :meta="$t('healthCoverageTable.meta')">
        <EmptyState v-if="rows.length === 0">
            <I18nT keypath="healthCoverageTable.empty" scope="global">
                <template #command>
                    <code class="font-mono">{{ TEST }}</code>
                </template>
            </I18nT>
        </EmptyState>
        <div v-else data-scroll-x class="overflow-x-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>{{ $t("healthCoverageTable.columns.project") }}</th>
                        <th
                            v-for="metric in COVERAGE_METRICS"
                            :key="metric"
                            class="numeric first-letter:uppercase"
                        >
                            {{ $t(`common.metrics.${metric}`) }}
                        </th>
                        <th class="numeric hidden sm:table-cell">
                            {{ $t("healthCoverageTable.columns.files") }}
                        </th>
                    </tr>
                    <tr class="bg-default">
                        <td class="font-medium text-highlighted">
                            {{ $t("healthCoverageTable.workspace") }}
                        </td>
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
                            <td class="numeric hidden font-mono sm:table-cell">{{ row.files }}</td>
                        </template>
                        <!-- Absent is its own state. Not 0%, and certainly not 100%. -->
                        <td v-else colspan="5" class="numeric font-mono text-dimmed">
                            {{ $t("healthCoverageTable.notCollected") }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="border-t border-default px-4 py-3 text-xs text-muted">
            {{ $t("healthCoverageTable.note") }}
        </p>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { CoverageArtifact } from "#layers/snapshot/shared/types/CoverageArtifact.ts";
import type { ProjectCoverage } from "#layers/snapshot/shared/types/ProjectCoverage.ts";

interface Props {
    projects: ProjectCoverage[];
    totals: CoverageArtifact["totals"];
}

const { projects, totals } = defineProps<Props>();

const TEST = "pnpm test:coverage";

const rows = computed(() =>
    projects
        .map((project) => ({
            ...project,
            to: `/projects/${folderOf(project.root)}?tab=coverage`,
            cells: COVERAGE_METRICS.map((key) => coverageCell(key, project[key]?.pct)),
        }))
        .toSorted((a, b) => (a.lines?.pct ?? 101) - (b.lines?.pct ?? 101)),
);

const totalCells = computed(() => COVERAGE_METRICS.map((key) => coverageCell(key, totals?.[key])));
const totalFiles = computed(() => projects.reduce((sum, project) => sum + project.files, 0));
</script>
