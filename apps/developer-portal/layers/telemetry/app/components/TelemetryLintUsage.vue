<template>
    <WidgetPanel :title="$t('telemetryLintUsage.title')" :meta="$t('telemetryLintUsage.meta')">
        <p class="border-b border-default px-4 py-2 text-xs text-muted">
            {{ $t("telemetryLintUsage.scope") }}
        </p>

        <div data-scroll-x class="overflow-x-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>{{ $t("telemetryLintUsage.columns.rule") }}</th>
                        <th
                            v-for="project in table.projects"
                            :key="project"
                            class="hidden w-32 min-w-32 text-center whitespace-nowrap md:table-cell"
                        >
                            {{ project }}
                        </th>
                        <th class="numeric">{{ $t("telemetryLintUsage.columns.total") }}</th>
                        <th class="numeric whitespace-nowrap">
                            {{ $t("telemetryLintUsage.columns.fixed") }}
                        </th>
                        <th class="numeric whitespace-nowrap">
                            {{ $t("telemetryLintUsage.columns.disabled") }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.rule">
                        <td class="font-mono text-xs whitespace-nowrap">{{ row.rule }}</td>
                        <td
                            v-for="cell in row.cells"
                            :key="cell.project"
                            class="hidden w-32 min-w-32 p-0.5 md:table-cell"
                        >
                            <div
                                class="flex h-8 items-center justify-center rounded-xs text-xs tabular-nums"
                                :style="cell.style"
                            >
                                {{ cell.count }}
                            </div>
                        </td>
                        <td class="numeric font-semibold">{{ row.hits }}</td>
                        <td class="numeric text-xs text-muted">{{ row.fixed }}</td>
                        <td class="numeric text-xs" :class="row.fought && 'tone-bad font-semibold'">
                            {{ row.disabled }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex flex-col gap-2 border-t border-default px-4 py-3">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
                <h2 class="text-sm font-semibold">
                    {{
                        $t("telemetryLintUsage.neverFired", {
                            quiet: quiet.length,
                            enabled: enabledCount,
                        })
                    }}
                </h2>
                <UButton
                    v-if="quiet.length > 0"
                    variant="link"
                    size="xs"
                    :label="
                        showQuiet ? $t('telemetryLintUsage.hide') : $t('telemetryLintUsage.show')
                    "
                    @click="showQuiet = !showQuiet"
                />
            </div>
            <p class="text-xs text-muted">{{ $t("telemetryLintUsage.quiet", { watching }) }}</p>
            <p v-if="showQuiet" class="font-mono text-xs/relaxed text-muted">
                {{ quietList }}
            </p>
        </div>
    </WidgetPanel>
</template>

<script setup lang="ts">
import { FOUGHT_DISABLES, neverFired } from "#layers/telemetry/shared/lintUsage.ts";
import { lintTable } from "#layers/telemetry/shared/usageView.ts";
import type { LintUsage } from "#layers/snapshot/shared/types/LintUsage.ts";

interface Props {
    lint: LintUsage;
}

const props = defineProps<Props>();

const { t } = useI18n();

const showQuiet = ref(false);

const table = computed(() => lintTable(props.lint));
const quiet = computed(() => neverFired(props.lint));
const quietList = computed(() => quiet.value.join(" · "));
const enabledCount = computed(
    () => Object.values(props.lint.rules).filter((r) => r.enabled).length,
);

const rows = computed(() => {
    const busiest = Math.max(1, ...table.value.rows.flatMap((row) => row.projects));

    return table.value.rows.map((row) => ({
        rule: row.rule,
        hits: row.hits || "—",
        fixed: row.hits ? `${percentOf(row.fixable, row.hits)}%` : "—",
        disabled: row.disabled || "—",
        fought: row.disabled >= FOUGHT_DISABLES,
        cells: table.value.projects.map((project, index) => {
            const count = row.projects[index] ?? 0;

            return {
                project,
                count: count || "",
                style: { background: heatColor("--usage-hits", count, busiest) },
            };
        }),
    }));
});

const watching = computed(() =>
    props.lint.since
        ? t("telemetryLintUsage.since", { since: props.lint.since })
        : t("telemetryLintUsage.nothingYet"),
);
</script>
