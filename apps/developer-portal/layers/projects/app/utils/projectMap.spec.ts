import { describe, expect, it } from "vitest";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import { projectMap } from "./projectMap.ts";

const project = (name: string, dependsOn: string[] = []): ProjectNode => ({
    name,
    root: `packages/${name}`,
    tags: [],
    dependsOn,
    dependedOnBy: [],
});

describe("projectMap", () => {
    it("draws one arrow per dependency, from the dependent to what it uses", () => {
        const { edges } = projectMap([
            project("site", ["ui", "content"]),
            project("ui", ["configs"]),
            project("content"),
            project("configs"),
        ]);

        expect(edges.map(({ from, to }) => [from, to])).toEqual([
            ["site", "ui"],
            ["site", "content"],
            ["ui", "configs"],
        ]);
        expect(edges.every(({ path }) => path.startsWith("M"))).toBe(true);
    });

    it("skips an edge to a project the snapshot doesn't list instead of inventing a node", () => {
        const { nodes, edges } = projectMap([project("site", ["retired"])]);

        expect(nodes.map(({ project: { name } }) => name)).toEqual(["site"]);
        expect(edges).toEqual([]);
    });

    it("places a dependent above what it depends on", () => {
        const { nodes } = projectMap([project("site", ["ui"]), project("ui")]);
        const top = Object.fromEntries(nodes.map(({ project: { name }, y }) => [name, y]));

        expect(top.site).toBeLessThan(top.ui!);
    });
});
