import type { ProjectRow } from "#layers/projects/app/types/ProjectRow.ts";

type KindId = "all" | "apps" | "packages" | "infrastructure";

const KINDS = [
    { id: "all", label: "All projects" },
    { id: "apps", label: "Apps" },
    { id: "packages", label: "Packages" },
    { id: "infrastructure", label: "Infrastructure" },
] as const satisfies { id: KindId; label: string }[];

/** The catalog as table rows, narrowed by the `kind` query and a search; `ready` settles on load. */
export const useProjectList = () => {
    const route = useRoute();
    const filter = computed<KindId>(
        () => KINDS.find((kind) => kind.id === route.query.kind)?.id ?? "all",
    );
    const current = computed(() => KINDS.find((kind) => kind.id === filter.value) ?? KINDS[0]);
    const crumbs = computed(() =>
        filter.value === "all"
            ? []
            : [{ label: "projects", to: "/projects" }, { label: filter.value }],
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
                        unreleased ? `+${unreleased} unreleased` : null,
                        `used by ${usedBy}`,
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
        KINDS.filter((kind) => kind.id !== "all")
            .map((kind) => ({ ...kind, rows: shown.value.filter((row) => row.kind === kind.id) }))
            .filter((group) => group.rows.length > 0),
    );

    return { filter, current, crumbs, search, shown, groups, ready };
};
