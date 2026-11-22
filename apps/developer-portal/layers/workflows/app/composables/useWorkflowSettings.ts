import { featuresOf, type TicketSize } from "#layers/workflows/shared/workflows.ts";

const SAVED_KEYS = ["title", "summary", "milestone", "area", "ticketSize"] as const;

/** A project's settings as a draft over its file, saved in one edit; `ready` settles on load. */
export const useWorkflowSettings = () => {
    const route = useRoute();
    const id = computed(() => String(route.params.id));

    const read = useWorkflows();
    const { data } = read;
    const { editable, edit } = useWorkflowEdit();

    const base = computed(() => data.value.projects.find(({ project }) => project.id === id.value));

    const switches: Record<string, boolean> = {};
    const ticketSize: TicketSize = "block";
    const draft = reactive({
        title: "",
        summary: "",
        milestone: "",
        area: "",
        switches,
        ticketSize,
    });

    const saved = computed(() => {
        const project = base.value?.project;
        const size: TicketSize = project?.ticketSize ?? "block";
        return {
            title: project?.title ?? "",
            summary: project?.summary ?? "",
            milestone: project?.milestone ?? "",
            area: project?.area ?? "",
            ticketSize: size,
        };
    });
    const discard = () => Object.assign(draft, saved.value, { switches: {} });
    watch(saved, discard, { immediate: true });

    const sizeFixed = computed(() => (base.value?.tickets.filed ?? 0) > 0);

    const features = computed(() => {
        if (!base.value) return [];
        const { project, template } = base.value;
        return featuresOf(
            { ...project, switches: { ...project.switches, ...draft.switches } },
            template,
        );
    });

    const toggle = (capability: string, on: boolean) => {
        const current = base.value?.features.find((feature) => feature.id === capability)?.enabled;
        if (on === current) delete draft.switches[capability];
        else draft.switches[capability] = on;
    };

    const changed = computed(
        () =>
            Object.keys(draft.switches).length > 0 ||
            SAVED_KEYS.some((key) => draft[key] !== saved.value[key]),
    );

    const saving = ref(false);
    const save = async () => {
        saving.value = true;
        await edit({ action: "settings", project: id.value, ...draft });
        saving.value = false;
    };

    const { leaving, leave } = useLeaveGuard(() => changed.value, discard);

    const remove = async () => {
        if (await edit({ action: "delete", project: id.value })) {
            discard();
            await navigateTo("/workflows");
        }
    };

    return {
        id,
        base,
        editable,
        draft,
        sizeFixed,
        features,
        toggle,
        changed,
        saving,
        save,
        discard,
        leaving,
        leave,
        remove,
        ready: read,
    };
};
