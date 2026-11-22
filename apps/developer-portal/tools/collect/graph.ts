import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import type { ProjectsArtifact } from "#layers/snapshot/shared/types/ProjectsArtifact.ts";
import { GRAPH_DIR, SNAPSHOT_DIR } from "../lib/paths.ts";
import { run } from "../lib/run.ts";

interface RawGraph {
    graph: {
        nodes: Record<
            string,
            {
                name: string;
                data: { root: string; tags?: string[]; targets?: Record<string, unknown> };
            }
        >;
        dependencies: Record<string, { source: string; target: string; type: string }[]>;
    };
}

/** Nx auto-adds `npm:private`; the tag table only ever talks about `type:` and `scope:`. */
export const isDeclaredTag = (tag: string): boolean =>
    tag.startsWith("type:") || tag.startsWith("scope:");

export const normalizeGraph = (
    raw: RawGraph,
    generatedAt: string,
): Omit<ProjectsArtifact, "retired"> => {
    const edges = Object.values(raw.graph.dependencies)
        .flat()
        .filter((edge) => edge.target in raw.graph.nodes);

    const projects: ProjectNode[] = Object.values(raw.graph.nodes)
        .map((node) => ({
            name: node.name,
            root: node.data.root,
            tags: (node.data.tags ?? []).filter(isDeclaredTag),
            dependsOn: edges
                .filter((edge) => edge.source === node.name)
                .map((edge) => edge.target)
                .sort((a, b) => a.localeCompare(b)),
            dependedOnBy: edges
                .filter((edge) => edge.target === node.name)
                .map((edge) => edge.source)
                .sort((a, b) => a.localeCompare(b)),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    return { generatedAt, projects };
};

export const collectGraph = async (
    generatedAt: string,
): Promise<Omit<ProjectsArtifact, "retired">> => {
    const jsonPath = resolve(SNAPSHOT_DIR, "nx-graph.raw.json");

    // `nx graph --file` resolves a relative path against the workspace root, not cwd, and the JSON
    // branch writes the file directly without creating its parent.
    await mkdir(SNAPSHOT_DIR, { recursive: true });
    await run("pnpm", ["exec", "nx", "graph", "--file", jsonPath]);

    await mkdir(GRAPH_DIR, { recursive: true });
    await run("pnpm", ["exec", "nx", "graph", "--file", resolve(GRAPH_DIR, "index.html")]);

    return normalizeGraph(JSON.parse(await readFile(jsonPath, "utf8")) as RawGraph, generatedAt);
};
