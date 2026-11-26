import {
    draftProject,
    estimateOf,
    featuresOf,
    pageId,
    pageProblems,
    PROJECT_ID,
    projectSlug,
    projectView,
    projectYaml,
    receiptOf,
    typedExtra,
    type Capability,
    type NewPage,
    type ReviewRow,
    type TicketSize,
} from "#layers/workflows/shared/workflows.ts";

const STEPS = [
    { id: "template", icon: "i-lucide-layout-template" },
    { id: "details", icon: "i-lucide-pencil" },
    { id: "pages", icon: "i-lucide-files" },
    { id: "features", icon: "i-lucide-layers" },
    { id: "review", icon: "i-lucide-check" },
] as const;

const NO_TICKETS = { block: 0, supervised: 0, fast: 0 } as const satisfies Record<
    TicketSize,
    number
>;

/** A field follows the title until someone types in it, and again once it is cleared. */
const derived = (from: () => string) => {
    const typed = ref<string | null>(null);
    return computed({
        get: () => typed.value ?? from(),
        set: (value: string) => {
            typed.value = value || null;
        },
    });
};

const saveFile = (name: string, text: string) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([text], { type: "text/yaml" }));
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
};

/** The new-project wizard's draft, steps and estimate; `ready` settles once the templates load. */
export const useNewProject = () => {
    const { t } = useI18n();
    const read = useWorkflows();
    const { data } = read;
    const { editable, edit } = useWorkflowEdit();

    const step = ref(0);
    const switches: Record<string, boolean> = {};
    const pageRows: { key: number; type: string; title: string }[] = [];
    const ticketSize: TicketSize = "block";
    const draft = reactive({
        template: "",
        title: "",
        summary: "",
        switches,
        pages: pageRows,
        ticketSize,
    });

    const fallback = computed(
        () =>
            (
                data.value.templates.find(({ capabilities }) => capabilities.length > 0) ??
                data.value.templates[0]
            )?.id ?? "",
    );
    const templateId = computed(() => draft.template || fallback.value);
    const template = computed(() => data.value.templates.find(({ id }) => id === templateId.value));

    const id = derived(() => projectSlug(draft.title));
    const milestone = derived(() => draft.title.trim());
    const area = derived(() => (id.value ? `app:${id.value}` : ""));

    const idError = computed(() => {
        if (id.value) return PROJECT_ID.test(id.value) ? undefined : t("newProject.errors.id");
        return draft.title.trim() ? t("newProject.errors.idEmpty") : undefined;
    });
    const milestoneError = computed(() => {
        const owner = data.value.projects.find(
            ({ project }) => project.milestone === milestone.value.trim(),
        );
        return owner
            ? t("newProject.errors.milestone", { project: owner.project.title })
            : undefined;
    });

    const shown = computed(() =>
        STEPS.filter(({ id }) => id !== "pages" || (template.value?.types.length ?? 0) > 0),
    );
    const steps = computed(() =>
        shown.value.map(({ id, icon }) => ({ title: t(`newProject.steps.${id}.title`), icon })),
    );
    const current = computed(() => {
        const { id } = shown.value[step.value] ?? STEPS[0];
        return {
            id,
            question: t(`newProject.steps.${id}.question`),
            hint: t(`newProject.steps.${id}.hint`),
        };
    });
    const last = computed(() => step.value === steps.value.length - 1);

    const pickTemplate = (picked: string) => {
        if (picked === templateId.value) return;
        draft.switches = {};
        draft.pages = [];
        draft.template = picked;
    };

    const pages = computed<NewPage[]>(() =>
        draft.pages.map(({ type, title }) => ({ id: pageId(title), type, title: title.trim() })),
    );
    const pageErrors = computed(() =>
        pageProblems(draft.pages, new Set(template.value?.capabilities.map(({ id }) => id))).map(
            (problem) =>
                problem && t(`newProject.pageProblems.${problem.code}`, { id: problem.id }),
        ),
    );
    const extras = computed<Capability[]>(() =>
        pages.value.flatMap((page) => {
            const type = template.value?.types.find(({ id }) => id === page.type);
            return type ? [typedExtra(type, page)] : [];
        }),
    );

    const features = computed(() =>
        template.value
            ? featuresOf(draftProject(template.value, draft.switches), template.value)
            : [],
    );
    const toggle = (feature: string, on: boolean) => {
        draft.switches = { ...draft.switches, [feature]: on };
    };

    const estimate = computed(() =>
        template.value ? estimateOf(template.value, draft.switches, extras.value) : null,
    );
    const receipt = computed(() =>
        template.value ? receiptOf(template.value, draft.switches, pages.value) : [],
    );
    const blocks = computed(() => estimate.value?.blocks ?? 0);
    const tickets = computed(() => estimate.value?.tickets ?? NO_TICKETS);
    const points = computed(() => estimate.value?.points ?? 0);

    const preview = computed(() =>
        template.value
            ? projectView(
                  draftProject(template.value, draft.switches, draft.ticketSize, extras.value),
                  template.value,
                  null,
              )
            : null,
    );

    const detailsDone = computed(() =>
        Boolean(
            draft.title.trim() &&
            id.value &&
            !idError.value &&
            milestone.value &&
            !milestoneError.value,
        ),
    );
    const canAdvance = computed(() => {
        if (current.value.id === "template") return template.value !== undefined;
        if (current.value.id === "details") return detailsDone.value;
        if (current.value.id === "pages") return pageErrors.value.every((error) => error === null);
        return true;
    });
    const next = () => {
        if (canAdvance.value && !last.value) step.value += 1;
    };
    const back = () => {
        step.value -= 1;
    };

    const pageList = computed(() =>
        pages.value
            .map(({ title, type }) => {
                const typeTitle = template.value?.types.find(({ id }) => id === type)?.title;
                return t("newProject.pageItem", { title, type: typeTitle ?? type });
            })
            .join(", "),
    );
    const featureList = (enabled: boolean) =>
        features.value
            .filter((feature) => feature.enabled === enabled)
            .map(({ title }) => title)
            .join(", ") || t("newProject.none");

    const review = computed((): ReviewRow[] => [
        { label: t("newProject.review.template"), value: template.value?.title ?? "" },
        { label: t("newProject.review.title"), value: draft.title },
        { label: t("newProject.review.summary"), value: draft.summary || "—" },
        { label: t("newProject.review.id"), value: id.value },
        { label: t("newProject.review.milestone"), value: milestone.value },
        { label: t("newProject.review.area"), value: area.value || "—" },
        { label: t("newProject.review.featuresOn"), value: featureList(true) },
        { label: t("newProject.review.leftOut"), value: featureList(false) },
        ...(shown.value.some(({ id }) => id === "pages")
            ? [
                  {
                      label: t("newProject.review.pages"),
                      value: pageList.value || t("newProject.none"),
                  },
              ]
            : []),
        {
            label: t("newProject.review.tickets"),
            value: t("newProject.review.ticketsValue", {
                size: t(`ticketSize.${draft.ticketSize}.title`),
                count: tickets.value[draft.ticketSize],
                blocks: blocks.value,
            }),
        },
        {
            label: t("newProject.review.complexity"),
            value: t("newProject.review.complexityValue", { points: points.value }),
        },
    ]);

    const fields = () => ({
        template: templateId.value,
        title: draft.title.trim(),
        summary: draft.summary.trim(),
        milestone: milestone.value.trim(),
        area: area.value.trim(),
        switches: draft.switches,
        ticketSize: draft.ticketSize,
        extras: pages.value,
    });

    const untouched = JSON.stringify(draft);
    const done = ref(false);
    const { leaving, leave } = useLeaveGuard(
        () => !done.value && (step.value > 0 || JSON.stringify(draft) !== untouched),
        () => {
            done.value = true;
        },
    );

    const creating = ref(false);
    const create = async () => {
        creating.value = true;
        const created = await edit({ action: "create", project: id.value, ...fields() });
        creating.value = false;

        if (created) {
            done.value = true;
            await navigateTo(`/workflows/${id.value}`);
        }
    };

    const download = () => saveFile(`${id.value}.yaml`, projectYaml({ id: id.value, ...fields() }));

    return {
        draft,
        step,
        steps,
        id,
        milestone,
        area,
        pickTemplate,
        toggle,
        next,
        back,
        create,
        download,
        leaving,
        leave,
        view: computed(() => ({
            step: current.value,
            templates: data.value.templates,
            templateId: templateId.value,
            template: template.value,
            idError: idError.value,
            milestoneError: milestoneError.value,
            features: features.value,
            pageErrors: pageErrors.value,
            review: review.value,
            preview: preview.value,
        })),
        footer: computed(() => ({
            id: id.value,
            first: step.value === 0,
            last: last.value,
            canAdvance: canAdvance.value,
            editable,
            creating: creating.value,
        })),
        summary: computed(() => ({
            template: template.value?.title ?? null,
            title: draft.title,
            blocks: blocks.value,
            tickets: tickets.value,
            points: points.value,
            receipt: receipt.value,
        })),
        ready: read,
    };
};
