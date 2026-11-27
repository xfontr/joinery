import { describe, expect, it } from "vitest";
import { normalizeGraph } from "./graph.ts";

describe("normalizeGraph", () => {
    it("sorts projects by name and keeps only declared tags", () => {
        const result = normalizeGraph(
            {
                graph: {
                    nodes: {
                        z: {
                            name: "zeta",
                            type: "app",
                            data: { root: "z", tags: ["scope:internal", "npm:private", "other"] },
                        },
                        a: {
                            name: "alpha",
                            type: "lib",
                            data: { root: "a", tags: ["type:lib", "npm:private"] },
                        },
                    },
                    dependencies: {},
                },
            },
            "now",
        );

        expect(result.projects.map((project) => project.name)).toEqual(["alpha", "zeta"]);
        expect(result.projects[0]?.tags).toEqual(["type:lib"]);
        expect(result.projects[1]?.tags).toEqual(["scope:internal"]);
    });

    it("sorts forward and reverse dependency edges while dropping missing targets", () => {
        const result = normalizeGraph(
            {
                graph: {
                    nodes: {
                        app: { name: "app", type: "app", data: { root: "apps/app" } },
                        docs: { name: "docs", type: "app", data: { root: "apps/docs" } },
                        ui: { name: "ui", type: "lib", data: { root: "packages/ui" } },
                    },
                    dependencies: {
                        app: [
                            { source: "app", target: "ui", type: "static" },
                            { source: "app", target: "docs", type: "static" },
                            { source: "app", target: "missing", type: "static" },
                        ],
                        ui: [{ source: "ui", target: "app", type: "static" }],
                    },
                },
            },
            "now",
        );

        expect(result.projects).toEqual([
            {
                name: "app",
                root: "apps/app",
                type: "app",
                tags: [],
                dependsOn: ["docs", "ui"],
                dependedOnBy: ["ui"],
            },
            {
                name: "docs",
                root: "apps/docs",
                type: "app",
                tags: [],
                dependsOn: [],
                dependedOnBy: ["app"],
            },
            {
                name: "ui",
                root: "packages/ui",
                type: "lib",
                tags: [],
                dependsOn: ["app"],
                dependedOnBy: ["app"],
            },
        ]);
    });
});
