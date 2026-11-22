<template>
    <UDashboardToolbar>
        <template #left>
            <UInput
                v-model="search"
                icon="i-lucide-search"
                placeholder="Search title or scope…"
                size="sm"
                class="w-56"
            />
            <USelect v-model="state" :items="STATES" value-key="value" size="sm" class="w-40" />
            <USelect v-model="scope" :items="scopeItems" value-key="value" size="sm" class="w-56" />
        </template>
        <template #right>
            <USelect v-model="sort" :items="SORTS" value-key="value" size="sm" class="w-44" />
        </template>
    </UDashboardToolbar>
</template>

<script setup lang="ts">
import type { AuditSort } from "#layers/audits/shared/auditReports.ts";
import { AUDIT_STATES, type AuditState } from "#layers/snapshot/shared/audits.ts";

interface Props {
    /** Every scope an audit covers, to filter by. */
    scopes: string[];
}

const { scopes } = defineProps<Props>();

const search = defineModel<string>("search", { required: true });
const state = defineModel<AuditState | "all">("state", { required: true });
const scope = defineModel<string>("scope", { required: true });
const sort = defineModel<AuditSort>("sort", { required: true });

const STATES = [
    { label: "Every state", value: "all" },
    ...AUDIT_STATES.map((value) => ({ label: auditStateLabel(value), value })),
];

const SORTS: { label: string; value: AuditSort }[] = [
    { label: "Newest first", value: "newest" },
    { label: "Oldest first", value: "oldest" },
    { label: "Most open", value: "most-open" },
];

const scopeItems = computed(() => [
    { label: "Every scope", value: "all" },
    ...scopes.map((value) => ({ label: value, value })),
]);
</script>
