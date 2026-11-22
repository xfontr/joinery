import { defineEventHandler } from "h3";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { ProjectsArtifact } from "#layers/snapshot/shared/types/ProjectsArtifact.ts";
import { readArtifact } from "#layers/snapshot/server/utils/store.ts";

const KINDS = [
    { id: "apps", labelKey: "app.menu.kinds.apps", icon: "i-lucide-app-window" },
    { id: "packages", labelKey: "app.menu.kinds.packages", icon: "i-lucide-package" },
    { id: "infrastructure", labelKey: "app.menu.kinds.infrastructure", icon: "i-lucide-server" },
] as const;

/** The sidebar's submenu: each kind with its count, holding its projects with their line coverage. */
export default defineEventHandler(async () => {
    const [projects, metrics] = await Promise.all([
        readArtifact<ProjectsArtifact>("projects"),
        readArtifact<MetricsArtifact>("metrics"),
    ]);
    const nodes = (projects?.projects ?? []).toSorted((a, b) => a.root.localeCompare(b.root));
    const coverage = new Map(
        (metrics?.projects ?? []).map((project) => [project.root, project.coverageLinesPct]),
    );

    const kinds = KINDS.map((kind) => {
        const members = nodes.filter((node) => node.root.startsWith(`${kind.id}/`));

        return {
            labelKey: kind.labelKey,
            icon: kind.icon,
            to: `/projects?kind=${kind.id}`,
            badge: String(members.length),
            children: members.map((node) => {
                const folder = node.root.split("/").at(-1) ?? node.root;
                const pct = coverage.get(node.root) ?? null;

                return {
                    label: folder,
                    icon: kind.icon,
                    to: `/projects/${folder}`,
                    badge: pct === null ? "—" : `${Math.round(pct)}%`,
                    coverage: pct,
                };
            }),
        };
    }).filter((kind) => kind.children.length > 0);

    return [
        {
            labelKey: "app.menu.allProjects",
            icon: "i-lucide-layers",
            to: "/projects",
            badge: String(nodes.length),
        },
        ...kinds,
    ];
});
