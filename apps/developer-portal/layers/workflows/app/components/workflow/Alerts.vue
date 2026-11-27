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
</template>

<script setup lang="ts">
interface Props {
    project: string;
    blank: boolean;
}

const { project, blank } = defineProps<Props>();

const EXTRAS = "extras";
</script>
