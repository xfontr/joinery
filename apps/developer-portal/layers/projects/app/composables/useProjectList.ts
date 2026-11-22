import type { ProjectRow } from "#layers/projects/app/types/ProjectRow.ts";

type KindId = "all" | "apps" | "packages" | "infrastructure";

const KINDS = ["all", "apps", "packages", "infrastructure"] as const satisfies KindId[];

/** The catalog as table rows, narrowed by the `kind` query and a search; `ready` settles on load. */
export const useProjectList = () => {
    const route = useRoute();
    const { t } = useI18n();
    const filter = computed<KindId>(() => KINDS.find((kind) => kind === route.query.kind) ?? "all");
    const current = computed(() => ({
        id: filter.value,
        label: t(`projects.kinds.${filter.value}`),
    }));
    const crumbs = computed(() =>
        filter.value === "all"
            ? []
            : [{ label: t("projects.crumb"), to: "/projects" }, { label: filter.value }],
    );

    const search = ref("");
    const { projects, metricFor, readmeFor, ready } = useCatalog();

    const rows = computed(() =>
        projects
            .map((project): ProjectRow => {
                const metric = metricFor(project);
                const version = metric?.currentVersion ?? null;
                const unreleased = metric?.unreleasedCommits ?? 0;
                const lines = metric?.coverageLinesPct ?? null;
                const usedBy = project.dependedOnBy.length;

                return {
                    name: project.name,
                    root: project.root,
                    to: `/projects/${folderOf(project.root)}`,
                    kind: project.root.split("/")[0] ?? "",
                    description: readmeFor(project)?.description ?? "",
                    version,
                    unreleased,
                    recent: metric?.commitsLastTwoWeeks ?? null,
                    specs: metric?.specs ?? null,
                    lines,
                    linesLabel: dash(lines, "%"),
                    tone: toneClass(coverageTone(lines)),
                    usedBy,
                    compact: [
                        version,
                        unreleased ? t("projects.row.unreleased", { count: unreleased }) : null,
                        t("projects.row.usedBy", { count: usedBy }),
                    ]
                        .filter(Boolean)
                        .join(" · "),
                };
            })
            .toSorted((a, b) => a.root.localeCompare(b.root)),
    );

    const shown = computed(() =>
        rows.value.filter(
            (row) =>
                (filter.value === "all" || row.kind === filter.value) &&
                row.name.toLowerCase().includes(search.value.toLowerCase()),
        ),
    );

    const groups = computed(() =>
        KINDS.filter((kind) => kind !== "all")
            .map((kind) => ({
                id: kind,
                label: t(`projects.kinds.${kind}`),
                rows: shown.value.filter((row) => row.kind === kind),
            }))
            .filter((group) => group.rows.length > 0),
    );

    return { filter, current, crumbs, search, shown, groups, ready };
};
