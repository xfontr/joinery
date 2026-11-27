<template>
    <div ref="root">
        <div class="border border-default bg-default">
            <table class="data-table" @keydown="move">
                <thead>
                    <tr>
                        <th>{{ $t("workflowList.columns.block") }}</th>
                        <th class="hidden sm:table-cell">{{ $t("workflowList.columns.state") }}</th>
                        <th class="hidden md:table-cell">
                            {{ $t("workflowList.columns.tickets") }}
                        </th>
                        <th class="numeric hidden md:table-cell">
                            {{ $t("workflowList.columns.points") }}
                        </th>
                        <th class="numeric">{{ $t("workflowList.columns.unblocks") }}</th>
                    </tr>
                </thead>
                <tbody
                    v-for="group in groups"
                    :key="group.id"
                    :data-stage="group.id"
                    class="scroll-mt-4"
                >
                    <tr>
                        <th
                            colspan="5"
                            scope="colgroup"
                            class="bg-muted text-left text-xs font-medium text-muted"
                        >
                            <span class="flex items-center gap-2">
                                <span
                                    class="size-2 rounded-xs"
                                    :style="{ background: group.color }"
                                    aria-hidden="true"
                                />
                                {{ group.title }}
                                <span class="font-mono">{{ group.progress }}</span>
                            </span>
                        </th>
                    </tr>
                    <tr
                        v-for="block in group.blocks"
                        :key="block.id"
                        :data-block="block.id"
                        class="cursor-pointer"
                        :class="block.id === selected && 'bg-elevated'"
                        :style="{ '--state': capabilityColor(block.state) }"
                        @click="emit('select', block.id)"
                    >
                        <td>
                            <button
                                type="button"
                                class="flex items-center gap-2 text-left font-medium text-highlighted"
                                :aria-pressed="block.id === selected"
                                @click.stop="emit('select', block.id)"
                            >
                                <span
                                    class="size-2.5 shrink-0 rounded-xs bg-(--state)"
                                    aria-hidden="true"
                                />
                                {{ block.title }}
                                <UIcon
                                    v-if="blockKindIcon(block.kind)"
                                    :name="blockKindIcon(block.kind)!"
                                    class="size-3.5 shrink-0 text-dimmed"
                                />
                            </button>
                        </td>
                        <td class="hidden text-xs font-medium text-(--state) sm:table-cell">
                            {{ $t(`workflows.capabilityState.${block.state}`) }}
                        </td>
                        <td class="hidden md:table-cell">
                            <span class="flex flex-wrap gap-1">
                                <span
                                    v-for="issue in block.issues"
                                    :key="issue.number"
                                    class="size-2.5 rounded-xs"
                                    :style="{ background: stateColor(ticketStatus(issue)) }"
                                    :title="`#${issue.number} ${issue.title}`"
                                />
                            </span>
                        </td>
                        <td class="numeric hidden font-mono md:table-cell">
                            {{ block.points.total > 0 ? formatPoints(block.points.total) : "—" }}
                        </td>
                        <td class="numeric font-mono">{{ block.unblockCount || "—" }}</td>
                    </tr>
                </tbody>
            </table>
            <EmptyState v-if="groups.length === 0">
                {{ $t("workflowList.none", { term }) }}
            </EmptyState>
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatPoints, ticketStatus, type StageView } from "#layers/workflows/shared/workflows.ts";

interface Props {
    stages: StageView[];
    selected: string | null;
    /** Words a block's title must hold, all of them, in any case. */
    term: string;
}

const { stages, selected, term } = defineProps<Props>();
const emit = defineEmits<{ select: [capability: string] }>();

const root = useTemplateRef("root");

/** Every switched-on block holding each word typed, under its stage; a stage left empty is dropped. */
const groups = computed(() => {
    const words = term.toLowerCase().split(/\s+/).filter(Boolean);
    return stages.flatMap((stage, index) => {
        const blocks = stage.capabilities.filter(
            ({ state, title }) =>
                state !== "off" && words.every((word) => title.toLowerCase().includes(word)),
        );
        return blocks.length > 0
            ? [
                  {
                      id: stage.id,
                      title: stage.title,
                      color: stageColor(index),
                      progress: `${stage.progress.done}/${stage.progress.total}`,
                      blocks,
                  },
              ]
            : [];
    });
});

const order = computed(() => groups.value.flatMap(({ blocks }) => blocks.map(({ id }) => id)));

const row = (capability: string) =>
    root.value?.querySelector<HTMLElement>(`tr[data-block="${capability}"]`);

const STEPS: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };

const move = (event: KeyboardEvent) => {
    const step = STEPS[event.key];
    if (!step) return;
    event.preventDefault();

    const at = selected ? order.value.indexOf(selected) : -1;
    const next = order.value[Math.min(Math.max(at + step, 0), order.value.length - 1)];
    // At either end the next block is the selected one, and picking it again would clear it.
    if (!next || next === selected) return;

    emit("select", next);
    void nextTick(() => row(next)?.querySelector("button")?.focus());
};

// Called on a click in the skyline only: the active stage also moves when a block is picked or
// cleared, and following that jumped the page.
const showStage = (picked: string) =>
    root.value?.querySelector(`tbody[data-stage="${picked}"]`)?.scrollIntoView({ block: "start" });

defineExpose({ showStage });

// A block picked elsewhere on the page, so its row isn't left scrolled out of sight.
watch(
    () => selected,
    (capability) => {
        if (capability) void nextTick(() => row(capability)?.scrollIntoView({ block: "nearest" }));
    },
);
</script>
