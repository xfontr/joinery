<template>
    <WidgetPanel
        :title="$t('telemetryFailureCauses.title')"
        :meta="$t('telemetryFailureCauses.meta')"
        :count="rows.length"
    >
        <p v-if="rows.length === 0" class="px-4 py-6 text-sm text-muted">
            {{ $t("telemetryFailureCauses.none") }}
        </p>

        <div v-else data-scroll-x class="overflow-x-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>{{ $t("telemetryFailureCauses.columns.script") }}</th>
                        <th class="numeric">{{ $t("telemetryFailureCauses.columns.refused") }}</th>
                        <th class="numeric">{{ $t("telemetryFailureCauses.columns.usage") }}</th>
                        <th class="numeric">{{ $t("telemetryFailureCauses.columns.crash") }}</th>
                        <th class="w-full">{{ $t("telemetryFailureCauses.columns.crashes") }}</th>
                        <th class="numeric whitespace-nowrap">
                            {{ $t("telemetryFailureCauses.columns.unknown") }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.name">
                        <td class="font-mono whitespace-nowrap text-highlighted">{{ row.name }}</td>
                        <td class="numeric font-mono">{{ row.refused || "—" }}</td>
                        <td class="numeric font-mono">{{ row.usage || "—" }}</td>
                        <td class="numeric font-mono" :class="row.crash > 0 && 'tone-bad'">
                            {{ row.crash || "—" }}
                        </td>
                        <td class="font-mono text-xs text-muted">{{ row.crashes || "—" }}</td>
                        <td class="numeric font-mono text-muted">{{ row.unknown || "—" }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import { failureCauseRows } from "#layers/telemetry/shared/usageView.ts";

interface Props {
    usage: Pick<UsageArtifact, "scripts">;
}

const { usage } = defineProps<Props>();

const rows = computed(() => failureCauseRows(usage));
</script>
