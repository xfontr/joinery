<template>
    <WidgetPanel
        title="Advisories"
        meta="Every finding pnpm audit reports, over the whole workspace lockfile"
        :count="advisories.length"
    >
        <div class="border-b border-default px-4 py-3">
            <SplitBar :parts legend />
        </div>
        <EmptyState v-if="advisories.length === 0">
            {{ counts ? "No known vulnerabilities." : "Not collected." }}
        </EmptyState>
        <div v-else data-scroll-x class="overflow-x-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Severity</th>
                        <th>Package</th>
                        <th class="hidden md:table-cell">Advisory</th>
                        <th class="numeric">Patched</th>
                        <th class="hidden lg:table-cell">Pulled in via</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in rows" :key="item.id">
                        <td class="font-mono text-xs" :class="item.tone">{{ item.severity }}</td>
                        <td>
                            <span class="block font-mono">{{ item.moduleName }}</span>
                            <a
                                :href="item.url"
                                target="_blank"
                                rel="noopener"
                                class="block text-xs text-muted hover:underline md:hidden"
                            >
                                {{ item.title }}
                            </a>
                        </td>
                        <td class="hidden md:table-cell">
                            <a
                                :href="item.url"
                                target="_blank"
                                rel="noopener"
                                class="hover:underline"
                            >
                                {{ item.title }}
                            </a>
                        </td>
                        <td class="numeric font-mono">{{ item.patchedVersions }}</td>
                        <td
                            class="hidden max-w-64 truncate font-mono text-xs text-muted lg:table-cell"
                            :title="item.via"
                        >
                            {{ item.via }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </WidgetPanel>
</template>

<script setup lang="ts">
import type { DepsArtifact } from "#layers/snapshot/shared/types/DepsArtifact.ts";
import type { VulnerabilityAdvisory } from "#layers/snapshot/shared/types/VulnerabilityAdvisory.ts";
import type { SplitPart } from "~/types/SplitPart";

interface Props {
    advisories: VulnerabilityAdvisory[];
    /** Null when the audit never ran, which is not the same as it finding nothing. */
    counts: DepsArtifact["vulnerabilities"];
}

const { advisories, counts } = defineProps<Props>();

const rows = computed(() =>
    advisories.map((item) => ({
        ...item,
        tone: toneClass(severityTone(item.severity)),
        via: item.paths.join(", "),
    })),
);

const parts = computed((): SplitPart[] => [
    { label: "critical", value: counts?.critical ?? 0, tone: "bad" },
    { label: "high", value: counts?.high ?? 0, tone: "bad" },
    { label: "moderate", value: counts?.moderate ?? 0, tone: "warn" },
    { label: "low", value: counts?.low ?? 0, tone: "soft" },
]);
</script>
