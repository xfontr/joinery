<template>
    <WidgetPanel
        title="Outdated dependencies"
        :meta="`pnpm outdated · collected ${age} · advisories are workspace-wide`"
        to="/deps"
        :count="outdated.length"
    >
        <div v-if="outdated.length > 0" data-scroll-x class="overflow-x-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Package</th>
                        <th class="numeric">Current</th>
                        <th class="numeric hidden sm:table-cell">Wanted</th>
                        <th class="numeric">Latest</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in outdated" :key="item.name">
                        <td class="font-mono">
                            {{ item.name }}
                            <span v-if="item.isDeprecated" class="tone-bad">deprecated</span>
                        </td>
                        <td class="numeric font-mono">{{ item.current }}</td>
                        <td class="numeric hidden font-mono sm:table-cell">{{ item.wanted }}</td>
                        <td class="numeric font-mono text-highlighted">{{ item.latest }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <EmptyState v-else>Everything is current.</EmptyState>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { OutdatedPackage } from "#layers/snapshot/shared/types/OutdatedPackage.ts";

interface Props {
    outdated: OutdatedPackage[];
    /** When the dependencies were collected, as relative time. */
    age: string;
}

const { outdated, age } = defineProps<Props>();
</script>
