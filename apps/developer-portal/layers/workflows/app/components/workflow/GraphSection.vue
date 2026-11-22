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
            <p class="text-xs text-muted">{{ note }}</p>
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
    /** Capability id to its title, for the chain left. */
    titles: Record<string, string>;
}

const { view, selected, titles } = defineProps<Props>();
const emit = defineEmits<{ select: [capability: string]; details: [capability: string] }>();

const { t } = useI18n();

const note = computed(() => {
    if (!selected) return "";

    const chain = view.critical.map((capability) => titles[capability]).join(" → ");
    const status = t("workflowGraphSection.status", {
        state: t(`workflows.capabilityState.${selected.state}`),
    });

    return chain ? t("workflowGraphSection.chain", { status, chain }) : status;
});
</script>
