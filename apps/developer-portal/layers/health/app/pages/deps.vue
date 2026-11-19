<template>
    <UDashboardPanel id="deps">
        <template #header>
            <PageHeader title="Dependencies">
                <template #intro>
                    <PageFacts :provenance :facts />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <WidgetPanel
                title="Advisories"
                meta="Every finding pnpm audit reports, over the whole workspace lockfile"
                :count="advisories.length"
            >
                <div class="border-b border-default px-4 py-3">
                    <SplitBar :parts="severityParts" legend />
                </div>
                <p v-if="advisories.length === 0" class="px-4 py-8 text-center text-sm text-muted">
                    {{ deps?.vulnerabilities ? "No known advisory." : "Not collected." }}
                </p>
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
                            <tr v-for="item in advisoryRows" :key="item.id">
                                <td class="font-mono text-xs" :class="item.tone">
                                    {{ item.severity }}
                                </td>
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

            <WidgetPanel
                title="Outdated"
                meta="pnpm outdated -r · wanted is what the range in package.json already allows"
                :count="outdated.length"
            >
                <p v-if="outdated.length === 0" class="px-4 py-8 text-center text-sm text-muted">
                    {{ deps?.outdated ? "Everything is on its wanted version." : "Not collected." }}
                </p>
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
                            <tr v-for="item in outdatedRows" :key="item.name">
                                <td class="font-mono">
                                    {{ item.name }}
                                    <span v-if="item.isDeprecated" class="tone-bad">
                                        deprecated
                                    </span>
                                </td>
                                <td class="numeric font-mono">{{ item.current }}</td>
                                <td class="numeric hidden font-mono sm:table-cell">
                                    {{ item.wanted }}
                                </td>
                                <td class="numeric font-mono text-highlighted">
                                    {{ item.latest }}
                                </td>
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
    </UDashboardPanel>
</template>

<script setup lang="ts">
import type { PageFact } from "~/components/PageFacts.vue";
import type { SplitPart } from "~/components/SplitBar.vue";

const SEVERITIES = ["critical", "high", "moderate", "low"] as const;

const { data: snapshot } = await useSnapshot("deps");

const deps = computed(() => snapshot.value?.deps ?? null);
const counts = computed(() => deps.value?.vulnerabilities ?? null);
const advisories = computed(() => deps.value?.advisories ?? []);
const outdated = computed(() => deps.value?.outdated ?? []);

const advisoryRows = computed(() =>
    advisories.value.map((item) => ({
        ...item,
        tone: toneClass(severityTone(item.severity)),
        via: item.paths.join(", "),
    })),
);

const outdatedRows = computed(() =>
    outdated.value.map((item) => ({ ...item, usedBy: item.dependents.join(", ") })),
);

const severityParts = computed((): SplitPart[] => [
    { label: "critical", value: counts.value?.critical ?? 0, tone: "bad" },
    { label: "high", value: counts.value?.high ?? 0, tone: "bad" },
    { label: "moderate", value: counts.value?.moderate ?? 0, tone: "warn" },
    { label: "low", value: counts.value?.low ?? 0, tone: "soft" },
]);

const provenance = computed(
    () => `pnpm audit and pnpm outdated · collected ${relativeTime(deps.value?.generatedAt)}`,
);

const facts = computed((): PageFact[] => [
    ...SEVERITIES.map((severity) => ({
        label: severity,
        value: counts.value ? String(counts.value[severity]) : "—",
        class: counts.value?.[severity] ? toneClass(severityTone(severity)) : "",
    })),
    { label: "Outdated", value: deps.value?.outdated ? String(outdated.value.length) : "—" },
    { label: "Dependencies", value: String(deps.value?.totalDependencies ?? "—") },
]);
</script>
