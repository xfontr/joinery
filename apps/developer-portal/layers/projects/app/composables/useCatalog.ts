import { deploymentUrlFor } from "#layers/github/shared/deployments.ts";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";

export interface ProjectLinks {
    website?: string;
    apiDocs?: string;
    storybook?: string;
    deploys?: string;
}

const AREA_ORDER: Record<string, number> = { apps: 0, infrastructure: 1, packages: 2 };

const CATEGORIES: Record<string, string> = {
    apps: "Application",
    packages: "Shared building block",
    infrastructure: "Repository tooling",
};

/** The last path segment, which names a project's page under `/projects/`. */
export const folderOf = (root: string): string => root.split("/").at(-1) ?? root;

/** A metric with its unit, or a dash for a project nothing collected it for. */
export const dash = (value: number | null | undefined, unit = ""): string =>
    typeof value === "number" ? `${value}${unit}` : "—";

export const categoryOf = (root: string): string =>
    CATEGORIES[root.split("/")[0] ?? ""] ?? "Repository project";

/** Every project with its metrics, README and links, shared by the catalog and each project page. */
export const useCatalog = async () => {
    // Read before the first await, which drops the Nuxt instance these need.
    const { data: live } = useDeployments();
    const {
        public: { repoUrl },
    } = useRuntimeConfig();
    const storybook = embedUrl("/huella-legal-storybook/");

    const [{ data: snapshot }, { data: metricsSnapshot }, { data: readmes }] = await Promise.all([
        useSnapshot("projects"),
        useSnapshot("metrics"),
        useAsyncData("project-readmes", () =>
            queryCollection("docs").select("path", "title", "description").all(),
        ),
    ]);
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

    const projects = computed(() =>
        (snapshot.value?.projects?.projects ?? []).toSorted((a, b) => {
            const aOrder = AREA_ORDER[a.root.split("/")[0] ?? ""] ?? Number.MAX_SAFE_INTEGER;
            const bOrder = AREA_ORDER[b.root.split("/")[0] ?? ""] ?? Number.MAX_SAFE_INTEGER;

            return aOrder === bOrder ? a.name.localeCompare(b.name) : aOrder - bOrder;
        }),
    );

    const retired = computed(() => snapshot.value?.projects?.retired ?? []);

    const PROJECT_LINKS: Record<
        string,
        {
            storybook?: string;
            deploys?: string;
            environment?: string;
            website?: () => string | undefined;
            apiDocs?: string;
        }
    > = {
        "@monorepo/huella-legal": {
            storybook,
            deploys: `${repoUrl}/actions/workflows/netlify-deployment.yml`,
            environment: "huella-legal",
            apiDocs: "/_scalar",
        },
        "@monorepo/developer-portal": {
            deploys: `${repoUrl}/actions/workflows/developer-portal-deploy.yml`,
            website: () => {
                try {
                    const { hostname, pathname } = new URL(repoUrl);
                    const [owner, repo] = pathname.split("/").filter(Boolean);

                    return owner && repo && hostname === "github.com"
                        ? `https://${owner}.github.io/${repo}/`
                        : undefined;
                } catch {
                    return undefined;
                }
            },
        },
    };

    const metricFor = (project: ProjectNode): ProjectMetrics | undefined =>
        metrics.value.get(project.name);

    const readmeFor = (project: ProjectNode) =>
        readmeByPath.value.get(`/${project.root.toLowerCase()}/readme`);

    const linksFor = (project: ProjectNode): ProjectLinks => {
        const links = PROJECT_LINKS[project.name];
        if (!links) return {};

        const website = links.environment
            ? deploymentUrlFor(live.value.deployments, links.environment)
            : links.website?.();

        return {
            website,
            apiDocs: links.apiDocs && website ? new URL(links.apiDocs, website).href : undefined,
            storybook: links.storybook,
            deploys: links.deploys,
        };
    };

    return { snapshot, projects, retired, live, metricFor, readmeFor, linksFor };
};
