import type { ElementDefinition, LayoutOptions, StylesheetJson } from "cytoscape";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import { folderOf } from "../../../../app/utils/format.ts";

export type RankDir = "TB" | "LR";

export interface ProjectGraphColors {
    node: string;
    nodeBorder: string;
    label: string;
    edge: string;
    folder: string;
    folderBorder: string;
    highlight: string;
    highlightLabel: string;
}

const folderId = (root: string) => `folder:${root.split("/")[0]}`;

/** The project with everything it depends on and everything depending on it, transitively. */
export const focusedProjects = (projects: ProjectNode[], name: string): Set<string> => {
    const byName = new Map(projects.map((project) => [project.name, project]));
    const walk = (key: "dependsOn" | "dependedOnBy") => {
        const reached = new Set<string>();
        const queue = [name];
        while (queue.length > 0) {
            for (const next of byName.get(queue.shift()!)?.[key] ?? []) {
                if (reached.has(next)) continue;
                reached.add(next);
                queue.push(next);
            }
        }
        return reached;
    };

    return new Set([name, ...walk("dependsOn"), ...walk("dependedOnBy")]);
};

/**
 * The visible projects, each inside its top-level folder when `grouped`, labelled like Nx's
 * `./apps (3 / 5)`, plus one edge per `dependsOn` link between two visible projects.
 */
export const projectGraphElements = (
    projects: ProjectNode[],
    visible: ReadonlySet<string>,
    grouped: boolean,
): ElementDefinition[] => {
    const shown = projects.filter(({ name }) => visible.has(name));
    const folders = Map.groupBy(projects, ({ root }) => folderId(root));

    return [
        ...(grouped
            ? [...folders]
                  .filter(([, members]) => members.some(({ name }) => visible.has(name)))
                  .map(([id, members]) => ({
                      group: "nodes" as const,
                      data: {
                          id,
                          label: `./${id.slice("folder:".length)} (${members.filter(({ name }) => visible.has(name)).length} / ${members.length})`,
                      },
                  }))
            : []),
        ...shown.map(({ name, root }) => ({
            group: "nodes" as const,
            data: {
                id: name,
                label: name,
                to: `/projects/${folderOf(root)}`,
                ...(grouped && { parent: folderId(root) }),
            },
        })),
        ...shown.flatMap(({ name, dependsOn }) =>
            dependsOn
                .filter((target) => visible.has(target))
                .map((target) => ({
                    group: "edges" as const,
                    data: { id: `${name}>${target}`, source: name, target },
                })),
        ),
    ];
};

// Nx's own project graph options, read from the `nx graph` client bundle.
export const projectGraphLayout = (rankDir: RankDir): LayoutOptions =>
    ({
        name: "dagre",
        nodeDimensionsIncludeLabels: true,
        rankSep: 75,
        edgeSep: 50,
        ranker: "network-simplex",
        padding: 20,
        animate: false,
        fit: true,
        rankDir,
    }) as LayoutOptions;

export const projectGraphStyle = (colors: ProjectGraphColors): StylesheetJson => [
    {
        selector: "node",
        style: {
            label: "data(label)",
            "font-family": "IBM Plex Sans, system-ui, sans-serif",
            "font-size": 12,
            "text-halign": "center",
            "text-valign": "top",
            color: colors.label,
            width: 24,
            height: 24,
            "background-color": colors.node,
            "border-width": 1,
            "border-color": colors.nodeBorder,
        },
    },
    {
        selector: ":parent",
        style: {
            shape: "rectangle",
            "font-size": 14,
            "background-color": colors.folder,
            "border-style": "dashed",
            "border-color": colors.folderBorder,
            padding: "12px",
        },
    },
    {
        selector: "edge",
        style: {
            width: 1,
            "curve-style": "unbundled-bezier",
            "line-color": colors.edge,
            "target-arrow-shape": "triangle",
            "target-arrow-fill": "filled",
            "target-arrow-color": colors.edge,
        },
    },
    {
        selector: "node.highlight:childless",
        style: {
            color: colors.highlightLabel,
            "font-weight": "bold",
            "background-color": colors.highlight,
            "border-color": colors.highlight,
        },
    },
    {
        selector: "edge.highlight",
        style: { "line-color": colors.highlight, "target-arrow-color": colors.highlight },
    },
    { selector: "node.transparent:childless", style: { opacity: 0.5 } },
    {
        selector: "node.transparent:parent",
        style: { "text-opacity": 0.5, "background-opacity": 0.25, "border-opacity": 0.5 },
    },
    { selector: "edge.transparent", style: { opacity: 0.2 } },
];
