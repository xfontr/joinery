<template>
    <WidgetPanel
        title="Coverage"
        :meta="coverage ? `Vitest · ${coverage.files} files · collected ${age}` : 'Not collected'"
        to="/coverage"
    >
        <dl v-if="rows.length > 0" class="grid sm:grid-cols-2">
            <div
                v-for="row in rows"
                :key="row.label"
                class="flex flex-col gap-2 border-b border-default p-4 sm:odd:border-r"
            >
                <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-sm text-toned first-letter:uppercase">{{ row.label }}</dt>
                    <dd data-figure class="text-2xl leading-none" :class="row.tone">
                        {{ row.pct }}%
                    </dd>
                </div>
                <SplitBar :parts="row.parts" />
            </div>
        </dl>
        <EmptyState v-else>No usable coverage report for this project.</EmptyState>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { ProjectCoverage } from "#layers/snapshot/shared/types/ProjectCoverage.ts";
import type { SplitPart } from "~/types/SplitPart";

interface Props {
    coverage: ProjectCoverage | undefined;
    /** When the coverage was collected, as relative time. */
    age: string;
}

const { coverage, age } = defineProps<Props>();

const rows = computed(() =>
    (["lines", "statements", "functions", "branches"] as const).flatMap((key) => {
        const value = coverage?.[key];

        return value
            ? [
                  {
                      label: key,
                      pct: value.pct,
                      tone: toneClass(coverageTone(value.pct)),
                      parts: [
                          { label: "covered", value: value.covered, tone: "ink" },
                          {
                              label: "not covered",
                              value: value.total - value.covered,
                              tone: "soft",
                          },
                      ] satisfies SplitPart[],
                  },
              ]
            : [];
    }),
);
</script>
