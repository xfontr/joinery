<template>
    <UCard>
        <template #header>
            <p class="font-semibold">{{ template.title }}</p>
            <p class="text-xs text-muted">{{ template.summary }}</p>
            <p class="mt-1 text-xs text-dimmed tabular-nums">{{ estimate }}</p>
            <p class="mt-1 flex items-center gap-1 text-xs text-dimmed">
                <UIcon name="i-lucide-toggle-left" class="size-3.5" />
                {{ $t("workflowTemplateCard.optional") }}
            </p>
        </template>

        <ol class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <li v-for="(stage, index) in stages" :key="stage.id">
                <p class="text-sm font-medium">{{ index + 1 }}. {{ stage.title }}</p>
                <p class="text-xs text-muted">{{ stage.goal }}</p>
                <ul class="mt-1 flex flex-wrap gap-1">
                    <li v-for="capability in stage.capabilities" :key="capability.id">
                        <UBadge
                            :label="capability.title"
                            :icon="capability.optional ? 'i-lucide-toggle-left' : undefined"
                            :variant="capability.optional ? 'outline' : 'subtle'"
                            color="neutral"
                            size="sm"
                        />
                    </li>
                </ul>
            </li>
        </ol>
    </UCard>
</template>

<script setup lang="ts">
import { templateEstimate, type Template } from "#layers/workflows/shared/workflows.ts";

interface Props {
    template: Template;
}

const { template } = defineProps<Props>();

const { t } = useI18n();

const estimate = computed(() => {
    const { blocks, tickets, points } = templateEstimate(template);
    return t("workflowTemplateCard.estimate", {
        blocks,
        points,
        block: tickets.block,
        fast: tickets.fast,
    });
});

const stages = computed(() =>
    template.stages.map((stage) => ({
        ...stage,
        capabilities: template.capabilities.filter((capability) => capability.stage === stage.id),
    })),
);
</script>
