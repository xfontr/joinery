import type { SettledState } from "#layers/workflows/shared/workflows.ts";
import { projectActivity } from "#layers/workflows/app/utils/workflowActivity.ts";

/** One workflow project, replayable to any synced day, with the block picked across the page. */
export const useWorkflowProject = () => {
    const route = useRoute();
    const id = computed(() => String(route.params.id));

    const read = useWorkflows();
    const { data } = read;
    const { editable, edit } = useWorkflowEdit();

    // The project as synced; the replay lays the same files over an earlier day.
    const base = computed(() => data.value.projects.find(({ project }) => project.id === id.value));
    const problems = computed(() =>
        data.value.problems
            .filter(({ file }) => file.startsWith(`projects/${id.value}.`))
            .map(({ file, message }) => `${file}: ${message}`),
    );

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
    const { selected, select } = selection;

    const settle = (settlement: { status: SettledState; note: string } | null) =>
        selected.value &&
        edit({
            action: "settle",
            project: id.value,
            block: selected.value.id,
            status: settlement?.status ?? null,
            note: settlement?.note ?? "",
        });

    const detailsOpen = ref(false);
    const openDetails = (capabilityId: string) => {
        select(capabilityId);
        detailsOpen.value = true;
    };

    return {
        id,
        base,
        problems,
        replay,
        view,
        activity,
        blank,
        titles,
        selection,
        unsorted: computed(() => (isLatest.value ? (view.value?.unsorted ?? []) : [])),
        canSettle: computed(() => editable && isLatest.value),
        settle,
        detailsOpen,
        openDetails,
        ready: read,
    };
};
