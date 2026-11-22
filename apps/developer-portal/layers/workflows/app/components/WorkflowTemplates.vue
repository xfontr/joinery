<template>
    <UCollapsible as="section" class="flex flex-col gap-3">
        <UButton
            :label="$t('workflowTemplates.title')"
            color="neutral"
            variant="ghost"
            trailing-icon="i-lucide-chevron-down"
            class="group self-start px-0 font-semibold"
            :ui="{ trailingIcon: 'transition-transform group-data-[state=open]:rotate-180' }"
        />

        <template #content>
            <div class="flex flex-col gap-3">
                <WorkflowTemplateCard v-for="template in templates" :key="template.id" :template />
            </div>
        </template>
    </UCollapsible>
</template>

<script setup lang="ts">
import type { Template } from "#layers/workflows/shared/workflows.ts";

interface Props {
    templates: Template[];
}

const { templates } = defineProps<Props>();
</script>
