<template>
    <WidgetPanel
        v-model:filter="kind"
        title="Work queue"
        meta="What's open across issues, decisions, audits, releases and docs"
        :count="shown.length"
        :filters
        :all
    >
        <EmptyState v-if="shown.length === 0">{{ empty }}</EmptyState>
        <ul v-else class="divide-y divide-default">
            <li v-for="row in page" :key="row.key">
                <component
                    :is="row.to ? NuxtLink : 'div'"
                    :to="row.to ?? undefined"
                    :target="row.external ? '_blank' : undefined"
                    class="flex items-baseline gap-3 px-4 py-2"
                    :class="row.to && 'hover:bg-elevated'"
                >
                    <span class="w-18 shrink-0 truncate font-mono text-xs text-muted">
                        {{ row.id }}
                    </span>
                    <span class="min-w-0 flex-1">
                        <span class="block truncate text-sm text-highlighted">
                            {{ row.title }}
                        </span>
                        <span class="block truncate font-mono text-xs text-muted sm:hidden">
                            {{ row.meta }}
                        </span>
                    </span>
                    <span
                        class="hidden max-w-60 shrink-0 truncate font-mono text-xs text-muted sm:block"
                    >
                        {{ row.meta }}
                    </span>
                </component>
            </li>
        </ul>
    </WidgetPanel>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import type { QueueKind } from "~/types/QueueKind";
import type { QueueRow } from "~/types/QueueRow";

interface Props {
    rows: Record<QueueKind, QueueRow[]>;
    /** Whether GitHub has answered yet, so a zero issue count isn't claimed before it has. */
    issuesRead: boolean;
    issuesError: boolean;
}

const { rows, issuesRead, issuesError } = defineProps<Props>();

const PAGE_SIZE = 8;

const FILTERS = [
    { value: "all", label: "All", to: null },
    { value: "issues", label: "Issues", to: "/issues" },
    { value: "decisions", label: "Decisions", to: "/decisions" },
    { value: "audits", label: "Audits", to: "/audits" },
    { value: "releases", label: "Releases", to: "/projects" },
    { value: "attention", label: "Attention", to: null },
] as const satisfies { value: QueueKind | "all"; label: string; to: string | null }[];

const kind = ref("all");

const isKind = (value: string): value is QueueKind => Object.hasOwn(rows, value);

const every = computed(() => Object.values(rows).flat());
const shown = computed(() => (isKind(kind.value) ? rows[kind.value] : every.value));
const page = computed(() => shown.value.slice(0, PAGE_SIZE));

const badgeFor = (value: QueueKind | "all"): number | undefined => {
    if (value === "all") return every.value.length;
    if (value === "issues" && !issuesRead) return undefined;
    return rows[value].length;
};

const filters = computed(() =>
    FILTERS.map(({ value, label }) => ({ value, label, badge: badgeFor(value) })),
);

const all = computed(() => {
    const to = FILTERS.find((filter) => filter.value === kind.value)?.to ?? null;
    return shown.value.length > PAGE_SIZE && to ? { label: `All ${shown.value.length}`, to } : null;
});

const empty = computed(() =>
    kind.value === "issues" && issuesError
        ? "GitHub could not be read from this browser."
        : "Nothing open here.",
);
</script>
