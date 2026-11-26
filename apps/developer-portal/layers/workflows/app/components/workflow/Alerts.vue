<template>
    <UAlert
        v-if="blank"
        color="info"
        variant="subtle"
        icon="i-lucide-map"
        :title="$t('workflowAlerts.blank.title')"
    >
        <template #description>
            <I18nT keypath="workflowAlerts.blank.description" scope="global">
                <template #extras>
                    <code class="font-mono">{{ EXTRAS }}</code>
                </template>
                <template #file>
                    <code class="font-mono">{{ `data/workflows/projects/${project}.yaml` }}</code>
                </template>
            </I18nT>
        </template>
    </UAlert>

    <UAlert
        v-if="problems.length > 0"
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        :title="$t('workflowAlerts.problems')"
    >
        <template #description>
            <ul class="list-disc pl-4">
                <li v-for="problem in problems" :key="problem">{{ problem }}</li>
            </ul>
        </template>
    </UAlert>

    <UAlert
        v-if="unsorted.length > 0"
        color="warning"
        variant="subtle"
        icon="i-lucide-inbox"
        :title="$t('workflowAlerts.unsorted.title', { count: unsorted.length })"
    >
        <template #description>
            <I18nT keypath="workflowAlerts.unsorted.lead" tag="p" scope="global">
                <template #label>
                    <code class="font-mono">{{ CAP_LABEL }}</code>
                </template>
            </I18nT>
            <ul class="mt-2 flex flex-col gap-1">
                <li
                    v-for="{ issue, reason, detail } in unsorted"
                    :key="issue.number"
                    class="flex items-center gap-3"
                >
                    <a :href="issue.url" target="_blank" class="font-mono text-xs text-dimmed">
                        #{{ issue.number }}
                    </a>
                    <span class="min-w-0 flex-1 truncate text-default">{{ issue.title }}</span>
                    <span class="text-xs">
                        {{ $t(`workflowAlerts.reasons.${reason}`, { detail }) }}
                    </span>
                </li>
            </ul>
        </template>
    </UAlert>
</template>

<script setup lang="ts">
import type { UnsortedIssue } from "#layers/workflows/shared/workflows.ts";

interface Props {
    project: string;
    blank: boolean;
    problems: string[];
    /** Issues still to place, or none while replaying an earlier day. */
    unsorted: UnsortedIssue[];
}

const { project, blank, problems, unsorted } = defineProps<Props>();

const EXTRAS = "extras";
const CAP_LABEL = "cap:<capability>";
</script>
