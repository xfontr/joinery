<template>
    <div class="flex flex-wrap items-center gap-2">
        <UInput
            v-model="search"
            icon="i-lucide-search"
            :placeholder="$t('auditsToolbar.search')"
            size="sm"
            class="w-56"
        />
        <USelect v-model="state" :items="stateItems" value-key="value" size="sm" class="w-40" />
        <USelect v-model="scope" :items="scopeItems" value-key="value" size="sm" class="w-56" />
        <USelect
            v-model="sort"
            :items="sortItems"
            value-key="value"
            size="sm"
            class="ml-auto w-44"
        />
    </div>
</template>

<script setup lang="ts">
import { AUDIT_SORTS, type AuditSort } from "#layers/audits/shared/auditReports.ts";
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

const { t } = useI18n();

const stateItems = computed(() =>
    filterItems(t("auditsToolbar.everyState"), AUDIT_STATES, (value) => t(`audits.state.${value}`)),
);

const sortItems = computed(() =>
    AUDIT_SORTS.map((value) => ({ label: t(`auditsToolbar.sorts.${value}`), value })),
);

const scopeItems = computed(() => filterItems(t("auditsToolbar.everyScope"), scopes));
</script>
