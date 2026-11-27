<template>
    <WidgetPanel
        :title="$t('projectDepsTab.title')"
        :meta="$t('projectDepsTab.meta')"
        to="/deps"
        :count="outdated.length"
    >
        <div v-if="outdated.length > 0" data-scroll-x class="overflow-x-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>{{ $t("projectDepsTab.columns.package") }}</th>
                        <th class="numeric">{{ $t("projectDepsTab.columns.current") }}</th>
                        <th class="numeric hidden sm:table-cell">
                            {{ $t("projectDepsTab.columns.wanted") }}
                        </th>
                        <th class="numeric">{{ $t("projectDepsTab.columns.latest") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in outdated" :key="item.name">
                        <td class="font-mono">
                            {{ item.name }}
                            <span v-if="item.isDeprecated" class="tone-bad">
                                {{ $t("projectDepsTab.deprecated") }}
                            </span>
                        </td>
                        <td class="numeric font-mono">{{ item.current }}</td>
                        <td class="numeric hidden font-mono sm:table-cell">{{ item.wanted }}</td>
                        <td class="numeric font-mono text-highlighted">{{ item.latest }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <EmptyState v-else>{{ $t("projectDepsTab.current") }}</EmptyState>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { OutdatedPackage } from "#layers/snapshot/shared/types/OutdatedPackage.ts";

interface Props {
    outdated: OutdatedPackage[];
}

const { outdated } = defineProps<Props>();
</script>
