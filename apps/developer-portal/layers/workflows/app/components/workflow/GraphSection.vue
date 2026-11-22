<template>
    <section class="rounded-2xl border border-default">
        <header class="border-b border-default px-4 py-3">
            <h2 class="text-sm font-semibold">
                Dependency graph<template v-if="selected"> · {{ selected.title }}</template>
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

const note = computed(() => {
    if (!selected) return "";

    const chain = view.critical.map((capability) => titles[capability]).join(" → ");
    const status = `${capabilityStateLabel(selected.state)}. Its path stays lit; click an empty spot for the whole map.`;

    return chain ? `${status} Longest chain left: ${chain}.` : status;
});
</script>
