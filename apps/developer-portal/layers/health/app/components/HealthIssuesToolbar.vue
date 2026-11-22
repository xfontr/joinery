<template>
    <UDashboardToolbar>
        <template #left>
            <UInput
                v-model="search"
                icon="i-lucide-search"
                :placeholder="$t('healthIssuesToolbar.search')"
                size="sm"
                class="w-56"
            />
        </template>
        <template #right>
            <USelect v-model="label" :items value-key="value" size="sm" class="w-40" />
        </template>
    </UDashboardToolbar>
</template>

<script setup lang="ts">
import { labelsOf, type Issue } from "#layers/github/app/utils/issues.ts";

interface Props {
    /** Every live issue, whose labels the filter offers. */
    issues: Issue[];
}

const { issues } = defineProps<Props>();

const search = defineModel<string>("search", { required: true });
const label = defineModel<string>("label", { required: true });

const { t } = useI18n();

const items = computed(() => filterItems(t("healthIssuesToolbar.everyLabel"), labelsOf(issues)));
</script>
