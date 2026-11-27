import { useMediaQuery } from "@vueuse/core";
import type { SettledState } from "#layers/workflows/shared/workflows.ts";
import { projectActivity } from "#layers/workflows/app/utils/workflowActivity.ts";

/** One workflow project, replayable to any synced day, with the block picked across the page. */
export const useWorkflowProject = () => {
    const route = useRoute();
    const id = computed(() => String(route.params.id));

    const read = useWorkflows();
    const { data } = read;
    const { editable, edit } = useWorkflowEdit();

    const base = computed(() => data.value.projects.find(({ project }) => project.id === id.value));

    const replay = useProjectReplay(base);
    const { view, isLatest } = replay;
    const syncedActivity = computed(() => (base.value ? projectActivity(base.value) : null));
    const activity = computed(() =>
        view.value && syncedActivity.value
            ? projectActivity(view.value, syncedActivity.value)
            : null,
    );

    const blank = computed(
        () => view.value?.capabilities.every(({ enabled }) => !enabled) ?? false,
    );
    const titles = computed(() =>
        Object.fromEntries(
            (view.value?.capabilities ?? []).map((capability) => [capability.id, capability.title]),
        ),
    );

    const selection = useCapabilitySelection(view);
    const { selected, select, clear } = selection;

    const settle = (settlement: { status: SettledState; note: string } | null) =>
        selected.value &&
        edit({
            action: "settle",
            project: id.value,
            block: selected.value.id,
            status: settlement?.status ?? null,
            note: settlement?.note ?? "",
        });

    /** Tailwind's `xl`, where the block pane fits beside the board. */
    const wide = useMediaQuery("(min-width: 80rem)");
    const detailsOpen = ref(false);
    /** Whether the pane shows beside the board; hiding it keeps the selection. */
    const paneShown = ref(true);
    /** Picking the selected block again clears it; picking one from nothing always opens the pane. */
    const pick = (capabilityId: string) => {
        const clearing = capabilityId === selection.selectedId.value;
        if (selection.selectedId.value === null) paneShown.value = true;
        select(capabilityId);
        if (!wide.value) detailsOpen.value = !clearing;
    };
    const deselect = () => {
        clear();
        detailsOpen.value = false;
    };

    return {
        id,
        base,
        replay,
        view,
        activity,
        blank,
        titles,
        selection,
        canSettle: computed(() => editable && isLatest.value),
        settle,
        wide,
        detailsOpen,
        pick,
        deselect,
        paneShown,
        ready: read,
    };
};
