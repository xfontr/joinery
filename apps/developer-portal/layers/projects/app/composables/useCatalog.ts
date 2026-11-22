import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";

/** Every project with its metrics and README; `ready` settles once the READMEs load. */
export const useCatalog = () => {
    const readmesRead = useAsyncData("project-readmes", () =>
        queryCollection("docs").select("path", "title", "description").all(),
    );
    const readmes = readmesRead.data;
    const metrics = new Map(
        metricsArtifact()?.projects.map((project) => [project.name, project]) ?? [],
    );

    const readmeByPath = computed(
        () =>
            new Map(
                (readmes.value ?? [])
                    .filter((page) => page.path !== "/readme" && page.path.endsWith("/readme"))
                    .map((page) => [page.path, page]),
            ),
    );

    const projects = projectsArtifact()?.projects ?? [];

    const metricFor = (project: ProjectNode): ProjectMetrics | undefined =>
        metrics.get(project.name);

    const readmeFor = (project: ProjectNode) =>
        readmeByPath.value.get(`/${project.root.toLowerCase()}/readme`);

    return {
        projects,
        metricFor,
        readmeFor,
        ready: readmesRead,
    };
};
