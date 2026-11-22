<template>
    <WidgetPanel
        title="Outdated"
        meta="pnpm outdated -r · wanted is what the range in package.json already allows"
        :count="rows.length"
    >
        <EmptyState v-if="rows.length === 0">
            {{ outdated ? "Everything is on its wanted version." : "Not collected." }}
        </EmptyState>
        <div v-else data-scroll-x class="overflow-x-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Package</th>
                        <th class="numeric">Current</th>
                        <th class="numeric hidden sm:table-cell">Wanted</th>
                        <th class="numeric">Latest</th>
                        <th class="numeric hidden sm:table-cell">Projects</th>
                        <th class="hidden lg:table-cell">Used by</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in rows" :key="item.name">
                        <td class="font-mono">
                            {{ item.name }}
                            <span v-if="item.isDeprecated" class="tone-bad">deprecated</span>
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
