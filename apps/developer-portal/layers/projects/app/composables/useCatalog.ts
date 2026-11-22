import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";

/** Every project with its metrics and README; `ready` settles once all three reads have. */
export const useCatalog = () => {
    const projectsRead = useSnapshot("projects");
    const metricsRead = useSnapshot("metrics");
    const readmesRead = useAsyncData("project-readmes", () =>
        queryCollection("docs").select("path", "title", "description").all(),
    );
    const snapshot = projectsRead.data;
    const metricsSnapshot = metricsRead.data;
    const readmes = readmesRead.data;
    const metrics = computed(
        () =>
            new Map(
                metricsSnapshot.value?.metrics?.projects.map((project) => [
                    project.name,
                    project,
                ]) ?? [],
            ),
    );

    const readmeByPath = computed(
        () =>
            new Map(
                (readmes.value ?? [])
                    .filter((page) => page.path !== "/readme" && page.path.endsWith("/readme"))
                    .map((page) => [page.path, page]),
            ),
    );

    const projects = computed(() => snapshot.value?.projects?.projects ?? []);

    const metricFor = (project: ProjectNode): ProjectMetrics | undefined =>
        metrics.value.get(project.name);

    const readmeFor = (project: ProjectNode) =>
        readmeByPath.value.get(`/${project.root.toLowerCase()}/readme`);

    return {
        projects,
        metricFor,
        readmeFor,
        ready: Promise.all([projectsRead, metricsRead, readmesRead]),
    };
};
