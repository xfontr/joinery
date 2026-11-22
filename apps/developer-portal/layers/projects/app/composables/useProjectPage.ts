import { areaLabel } from "#layers/github/app/utils/issues.ts";
import type { PageTab } from "~/types/PageTab";
import type { ProjectTab } from "~/types/ProjectTab";
import type { ProjectTabRow } from "~/types/ProjectTabRow";

const BUILT_IN = [
    { id: "readme", label: "README" },
    { id: "coverage", label: "Coverage" },
    { id: "deps", label: "Dependencies" },
    { id: "issues", label: "Issues" },
];

/**
 * Everything a project page shows but its README, with the tabs other layers add through
 * `projectTabs`. Every read starts here and `ready` settles once the tabs' routes answer.
 */
export const useProjectPage = () => {
    const { projectTabs = {} }: { projectTabs?: Record<string, ProjectTab | undefined> } =
        useAppConfig();
    const registered = Object.entries(projectTabs).flatMap(([id, entry]) =>
        entry ? [{ id, ...entry }] : [],
    );
    const all = [...BUILT_IN, ...registered.map(({ id, label }) => ({ id, label }))];

    const route = useRoute("projects-name");
    const name = computed(() => String(route.params.name));
    const tab = computed(() =>
        all.some((item) => item.id === route.query.tab) ? String(route.query.tab) : "readme",
    );

    const { shown: read } = useIssues();
    const extraReads = registered.map((entry) =>
        useFetch<Record<string, ProjectTabRow[]>>(entry.rows, {
            key: `project-tab-${entry.id}`,
            default: () => ({}),
        }),
    );
    const extraRows = extraReads.map((read) => read.data);
    const coverageSnapshot = coverageArtifact();
    const deps = depsArtifact();

    const projects = projectsArtifact()?.projects ?? [];
    const project = computed(() =>
        projects.find((candidate) => folderOf(candidate.root) === name.value),
    );

    const coverage = computed(() =>
        coverageSnapshot?.projects.find((item) => item.root === project.value?.root),
    );
    const outdated = computed(
        () =>
            deps?.outdated?.filter((item) => item.dependents.includes(project.value?.root ?? "")) ??
            [],
    );

    const extra = computed(() => {
        const index = registered.findIndex((entry) => entry.id === tab.value);
        const entry = registered[index];
        return entry ? { ...entry, items: extraRows[index]?.value[name.value] ?? [] } : null;
    });

    const area = computed(() => areaLabel(project.value?.root ?? `infrastructure/${name.value}`));
    const issues = computed(() => ({
        read: Boolean(read.value.fetchedAt),
        area: area.value,
        list: read.value.issues
            .filter((issue) => issue.labels.includes(area.value))
            .map((issue) => ({ ...issue, age: shortAge(issue.updatedAt) })),
    }));

    const counts = computed((): Partial<Record<string, number | string>> => ({
        coverage: coverage.value?.lines ? `${coverage.value.lines.pct}%` : undefined,
        deps: outdated.value.length,
        issues: issues.value.read ? issues.value.list.length : undefined,
        ...Object.fromEntries(
            registered.map((entry, index) => [
                entry.id,
                extraRows[index]?.value[name.value]?.length ?? 0,
            ]),
        ),
    }));

    const tabs = computed((): PageTab[] =>
        all.map((item) => ({
            label: item.label,
            to: item.id === "readme" ? route.path : `${route.path}?tab=${item.id}`,
            active: item.id === tab.value,
            count: counts.value[item.id],
        })),
    );

    return {
        name,
        tab,
        tabs,
        project,
        metric: computed(() =>
            metricsArtifact()?.projects.find((item) => item.name === project.value?.name),
        ),
        projects,
        coverage,
        coverageAge: relativeTime(coverageSnapshot?.generatedAt),
        outdated,
        depsAge: relativeTime(deps?.generatedAt),
        extra,
        issues,
        ready: Promise.all(extraReads),
    };
};
