<template>
    <ul v-if="groups.length > 0" class="flex flex-wrap gap-2 text-sm">
        <li v-for="group in groups" :key="group.state">
            <UPopover v-model:open="open[group.state]">
                <button
                    type="button"
                    class="flex items-center gap-1.5 rounded-sm border border-(--state)/40 bg-(--state)/12 px-2.5 py-0.5 tabular-nums transition hover:bg-(--state)/24"
                    :style="{ '--state': group.color }"
                >
                    <span class="font-semibold text-(--state)">{{ group.blocks.length }}</span>
                    {{ group.label }}
                    <UIcon name="i-lucide-chevron-down" class="size-3.5" />
                </button>
                <template #content>
                    <ul
                        class="flex max-h-80 w-72 flex-col overflow-y-auto p-1"
                        :aria-label="$t('workflowLeft.blocks', { state: group.label })"
                    >
                        <li v-for="block in group.blocks" :key="block.id">
                            <button
                                type="button"
                                class="flex w-full items-baseline gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-elevated"
                                :class="block.id === selected && 'font-semibold'"
                                @click="pick(group.state, block.id)"
                            >
                                <span class="min-w-0 flex-1 truncate">{{ block.title }}</span>
                                <span
                                    v-if="block.unblockCount > 0"
                                    class="shrink-0 text-xs text-muted tabular-nums"
                                >
                                    {{ $t("workflowLeft.unblocks", { count: block.unblockCount }) }}
                                </span>
                            </button>
                        </li>
                    </ul>
                </template>
            </UPopover>
        </li>
    </ul>
    <p v-else-if="blank" class="text-sm text-muted">{{ $t("workflowLeft.none") }}</p>
    <p v-else class="text-sm text-muted">{{ $t("workflowLeft.done") }}</p>
</template>

<script setup lang="ts">
import type { CapabilityState, CapabilityView } from "#layers/workflows/shared/workflows.ts";

interface Props {
    /** Every unfinished block, already ranked. */
    blocks: CapabilityView[];
    selected: string | null;
    /** Whether the project has no blocks switched on at all. */
    blank: boolean;
}

const { blocks, selected, blank } = defineProps<Props>();
const emit = defineEmits<{ select: [capability: string] }>();

const { t } = useI18n();

const groups = computed(() => {
    const byState = new Map<CapabilityState, CapabilityView[]>();
    for (const block of blocks) {
        byState.set(block.state, [...(byState.get(block.state) ?? []), block]);
    }

    return [...byState].map(([state, members]) => ({
        state,
        blocks: members,
        color: capabilityColor(state),
        label: t(`workflows.capabilityState.${state}`).toLocaleLowerCase(),
    }));
});

const open = ref<Partial<Record<CapabilityState, boolean>>>({});
const pick = (state: CapabilityState, capability: string) => {
    open.value[state] = false;
    emit("select", capability);
};
</script>
