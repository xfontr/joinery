<template>
    <section class="rounded-2xl border border-default">
        <header class="border-b border-default px-4 py-3">
            <h2 class="text-sm font-semibold">
                {{
                    selected
                        ? $t("workflowGraphSection.titleSelected", { title: selected.title })
                        : $t("workflowGraphSection.title")
                }}
            </h2>
            <p v-if="selected" class="text-xs text-muted">{{ $t("workflowGraphSection.hint") }}</p>
        </header>
        <WorkflowGraph
            :capabilities="view.capabilities"
            :stages="view.stages"
            :selected="selected?.id ?? null"
            class="rounded-t-none"
            @select="emit('select', $event)"
            @details="emit('details', $event)"
        />
    </section>
</template>

<script setup lang="ts">
import type { CapabilityView, ProjectView } from "#layers/workflows/shared/workflows.ts";

interface Props {
    view: ProjectView;
    selected?: CapabilityView;
}

const { view, selected } = defineProps<Props>();
const emit = defineEmits<{ select: [capability: string]; details: [capability: string] }>();
</script>
