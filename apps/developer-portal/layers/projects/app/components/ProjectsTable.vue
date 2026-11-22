<template>
    <div data-scroll-x class="overflow-x-auto border border-default bg-default">
        <table class="data-table">
            <thead>
                <tr>
                    <th>{{ $t("projectsTable.columns.project") }}</th>
                    <th class="numeric hidden md:table-cell">
                        {{ $t("projectsTable.columns.version") }}
                    </th>
                    <th class="numeric hidden md:table-cell">
                        {{ $t("projectsTable.columns.unreleased") }}
                    </th>
                    <th class="numeric hidden md:table-cell">
                        {{ $t("projectsTable.columns.recent") }}
                    </th>
                    <th class="numeric hidden md:table-cell">
                        {{ $t("projectsTable.columns.specs") }}
                    </th>
                    <th class="numeric">{{ $t("projectsTable.columns.lines") }}</th>
                    <th class="numeric hidden md:table-cell">
                        {{ $t("projectsTable.columns.usedBy") }}
                    </th>
                </tr>
            </thead>
            <tbody v-for="group in groups" :key="group.id">
                <tr v-if="headed">
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
                            <span class="max-w-xl text-xs text-muted">{{ row.description }}</span>
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
                        :class="row.unreleased ? 'font-medium text-highlighted' : 'text-dimmed'"
                    >
                        {{ row.unreleased ? `+${row.unreleased}` : "—" }}
                    </td>
                    <td class="numeric hidden font-mono md:table-cell">{{ row.recent ?? "—" }}</td>
                    <td class="numeric hidden font-mono md:table-cell">{{ row.specs ?? "—" }}</td>
                    <td
                        data-meter
                        :style="{ '--pct': row.lines ?? 0 }"
                        class="numeric font-mono"
                        :class="row.tone"
                    >
                        {{ row.linesLabel }}
                    </td>
                    <td class="numeric hidden font-mono md:table-cell">{{ row.usedBy }}</td>
                </tr>
            </tbody>
        </table>
        <EmptyState v-if="groups.length === 0"><slot name="empty" /></EmptyState>
    </div>
</template>

<script setup lang="ts">
import type { ProjectRow } from "#layers/projects/app/types/ProjectRow.ts";

interface Props {
    groups: { id: string; label: string; rows: ProjectRow[] }[];
    /** Heads each group with its name and count, for the unfiltered list. */
    headed: boolean;
}

const { groups, headed } = defineProps<Props>();
</script>
