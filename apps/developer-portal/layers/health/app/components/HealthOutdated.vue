<template>
    <WidgetPanel
        :title="$t('healthOutdated.title')"
        :meta="$t('healthOutdated.meta')"
        :count="rows.length"
    >
        <EmptyState v-if="rows.length === 0">
            {{ outdated ? $t("healthOutdated.upToDate") : $t("healthOutdated.notCollected") }}
        </EmptyState>
        <div v-else data-scroll-x class="overflow-x-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>{{ $t("healthOutdated.columns.package") }}</th>
                        <th class="numeric">{{ $t("healthOutdated.columns.current") }}</th>
                        <th class="numeric hidden sm:table-cell">
                            {{ $t("healthOutdated.columns.wanted") }}
                        </th>
                        <th class="numeric">{{ $t("healthOutdated.columns.latest") }}</th>
                        <th class="numeric hidden sm:table-cell">
                            {{ $t("healthOutdated.columns.projects") }}
                        </th>
                        <th class="hidden lg:table-cell">
                            {{ $t("healthOutdated.columns.usedBy") }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in rows" :key="item.name">
                        <td class="font-mono">
                            {{ item.name }}
                            <span v-if="item.isDeprecated" class="tone-bad">
                                {{ $t("healthOutdated.deprecated") }}
                            </span>
                        </td>
                        <td class="numeric font-mono">{{ item.current }}</td>
                        <td class="numeric hidden font-mono sm:table-cell">{{ item.wanted }}</td>
                        <td class="numeric font-mono text-highlighted">{{ item.latest }}</td>
                        <td class="numeric hidden font-mono sm:table-cell">
                            {{ item.dependents.length }}
                        </td>
                        <td
                            class="hidden max-w-64 truncate font-mono text-xs text-muted lg:table-cell"
                            :title="item.usedBy"
                        >
                            {{ item.usedBy }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { OutdatedPackage } from "#layers/snapshot/shared/types/OutdatedPackage.ts";

interface Props {
    /** Null when `pnpm outdated` never ran, which is not the same as nothing being outdated. */
    outdated: OutdatedPackage[] | null;
}

const { outdated } = defineProps<Props>();

const rows = computed(() =>
    (outdated ?? []).map((item) => ({ ...item, usedBy: item.dependents.join(", ") })),
);
</script>
