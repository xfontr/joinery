import type { ComputedRef } from "vue";
import type { ProjectView } from "#layers/workflows/shared/workflows.ts";

/** One block, picked anywhere and kept in `?block=`, drives every view and the block pane. */
export const useCapabilitySelection = (view: ComputedRef<ProjectView | undefined>) => {
    const route = useRoute();
    const router = useRouter();

    const chosenId = computed(() =>
        typeof route.query.block === "string" ? route.query.block : null,
    );
    /** What was picked, while it is still on the map; nothing picked leaves the pane closed. */
    const selectedId = computed(() =>
        view.value?.capabilities.some(
            ({ id: other, state }) => other === chosenId.value && state !== "off",
        )
            ? chosenId.value
            : null,
    );
    const selected = computed(() =>
        view.value?.capabilities.find((capability) => capability.id === selectedId.value),
    );

    const stageId = ref<string | null>(null);
    const activeIndex = computed(() => {
        const stages = view.value?.stages ?? [];
        const wanted = stageId.value ?? selected.value?.stage ?? view.value?.left[0]?.stage;
        return Math.max(
            stages.findIndex((stage) => stage.id === wanted),
            0,
        );
    });
    const activeStage = computed(() => view.value?.stages[activeIndex.value]);

    // Replaced rather than pushed, so clicking through the skyline doesn't fill the back button.
    const choose = (block: string | undefined) =>
        void router.replace({ query: { ...route.query, block } });

    const select = (capabilityId: string) => {
        stageId.value = null;
        choose(capabilityId === selectedId.value ? undefined : capabilityId);
    };
    const clear = () => choose(undefined);

    return {
        selectedId,
        selected,
        stageId,
        activeIndex,
        activeStage,
        select,
        clear,
    };
};
