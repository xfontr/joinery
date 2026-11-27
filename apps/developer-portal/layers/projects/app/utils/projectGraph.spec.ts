import { describe, expect, it } from "vitest";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import { focusedProjects, projectGraphElements } from "./projectGraph.ts";

const project = (root: string, dependsOn: string[] = [], dependedOnBy: string[] = []) =>
    ({
        name: root.split("/")[1]!,
        root,
        tags: [],
        dependsOn,
        dependedOnBy,
    }) satisfies ProjectNode;

const SITE = project("apps/site", ["ui"]);
const BLOG = project("apps/blog");
const UI = project("packages/ui", ["configs"], ["site"]);
const CONFIGS = project("packages/configs", [], ["ui"]);
const ALL = [SITE, BLOG, UI, CONFIGS];
const everyone = new Set(ALL.map(({ name }) => name));

const ids = (elements: ReturnType<typeof projectGraphElements>, group: "nodes" | "edges") =>
    elements.filter((element) => element.group === group).map(({ data }) => data.id);

describe("projectGraphElements", () => {
    it("draws one arrow per dependency, from the dependent to what it uses", () => {
        expect(ids(projectGraphElements(ALL, everyone, false), "edges")).toEqual([
            "site>ui",
            "ui>configs",
        ]);
    });

    it("boxes each project in its top-level folder, counting how many of the folder are shown", () => {
        const elements = projectGraphElements(ALL, new Set(["site", "ui", "configs"]), true);
        const folders = elements.filter(({ data }) => data.id?.startsWith("folder:"));

        expect(folders.map(({ data }) => data.label)).toEqual([
            "./apps (1 / 2)",
            "./packages (2 / 2)",
        ]);
        expect(elements.find(({ data }) => data.id === "site")?.data.parent).toBe("folder:apps");
    });

    it("drops a hidden project and every arrow touching it", () => {
        const elements = projectGraphElements(ALL, new Set(["site", "configs"]), false);

        expect(ids(elements, "nodes")).toEqual(["site", "configs"]);
        expect(ids(elements, "edges")).toEqual([]);
    });

    it("leaves out a folder with nothing shown instead of drawing an empty box", () => {
        const elements = projectGraphElements(ALL, new Set(["ui"]), true);

        expect(ids(elements, "nodes")).toEqual(["folder:packages", "ui"]);
    });
});

describe("focusedProjects", () => {
    it("keeps the whole chain a project sits in, both ways, and nothing beside it", () => {
        expect([...focusedProjects(ALL, "ui")].sort()).toEqual(["configs", "site", "ui"]);
        expect([...focusedProjects(ALL, "site")].sort()).toEqual(["configs", "site", "ui"]);
        expect([...focusedProjects(ALL, "blog")]).toEqual(["blog"]);
    });
});
