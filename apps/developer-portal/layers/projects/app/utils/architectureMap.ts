import { Graph, layout as runLayout, type EdgeLabel, type NodeLabel } from "@dagrejs/dagre";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";

export const MAP_NODE_WIDTH = 184;
export const MAP_NODE_HEIGHT = 48;
const MAP_PADDING = 24;

const smoothPath = (points: { x: number; y: number }[]): string => {
    const [first, ...rest] = points;
    const last = rest.at(-1);
    if (!first || !last) return "";

    let path = `M${first.x},${first.y}`;
    for (let index = 0; index < rest.length - 1; index++) {
        const point = rest[index]!;
        const next = rest[index + 1]!;
        path += ` Q${point.x},${point.y} ${(point.x + next.x) / 2},${(point.y + next.y) / 2}`;
    }

    return `${path} L${last.x},${last.y}`;
};

/** Dependents above what they depend on, one arrow per `dependsOn` edge between listed projects. */
export const architectureMap = (projects: ProjectNode[]) => {
    const graph = new Graph<object, NodeLabel, EdgeLabel>();
    graph.setGraph({
        rankdir: "TB",
        nodesep: 24,
        ranksep: 56,
        marginx: MAP_PADDING,
        marginy: MAP_PADDING,
    });
    graph.setDefaultEdgeLabel(() => ({}));

    const listed = new Set(projects.map(({ name }) => name));
    for (const { name } of projects)
        graph.setNode(name, { width: MAP_NODE_WIDTH, height: MAP_NODE_HEIGHT });

    const links = projects.flatMap(({ name, dependsOn }) =>
        dependsOn.filter((target) => listed.has(target)).map((target) => [name, target] as const),
    );
    for (const [from, to] of links) graph.setEdge(from, to);

    runLayout(graph);

    const label = graph.graph() as { width?: number; height?: number };

    return {
        width: label.width ?? 0,
        height: label.height ?? 0,
        nodes: projects.map((project) => {
            const node = graph.node(project.name);
            return {
                project,
                x: (node.x ?? 0) - MAP_NODE_WIDTH / 2,
                y: (node.y ?? 0) - MAP_NODE_HEIGHT / 2,
            };
        }),
        edges: links.map(([from, to]) => ({
            key: `${from}>${to}`,
            from,
            to,
            path: smoothPath(graph.edge(from, to).points ?? []),
        })),
    };
};
