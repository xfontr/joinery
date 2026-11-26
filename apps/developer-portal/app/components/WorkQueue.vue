<template>
    <WidgetPanel
        v-model:filter="kind"
        :title="$t('workQueue.title')"
        :meta="$t('workQueue.meta')"
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
    { value: "issues", to: "/issues" },
    { value: "decisions", to: "/decisions" },
    { value: "audits", to: "/audits" },
    { value: "releases", to: "/projects" },
    { value: "attention", to: null },
] as const satisfies { value: QueueKind; to: string | null }[];

const { t } = useI18n();

const kind = ref<string>("issues");

const isKind = (value: string): value is QueueKind => Object.hasOwn(rows, value);

const shown = computed(() => (isKind(kind.value) ? rows[kind.value] : []));
const page = computed(() => shown.value.slice(0, PAGE_SIZE));

const badgeFor = (value: QueueKind): number | undefined => {
    if (value === "issues" && !issuesRead) return undefined;
    return rows[value].length;
};

const filters = computed(() =>
    FILTERS.map(({ value }) => ({
        value,
        label: t(`workQueue.filters.${value}`),
        badge: badgeFor(value),
    })),
);

const all = computed(() => {
    const to = FILTERS.find((filter) => filter.value === kind.value)?.to ?? null;
    return shown.value.length > PAGE_SIZE && to
        ? { label: t("workQueue.all", { count: shown.value.length }), to }
        : null;
});

const empty = computed(() => {
    if (kind.value !== "issues") return t("workQueue.empty");
    if (!issuesRead) return t("workQueue.reading");
    return issuesError ? t("workQueue.githubError") : t("workQueue.empty");
});
</script>
