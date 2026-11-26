import { describe, expect, it } from "vitest";
import type { ProjectManifest } from "./readme.ts";
import { constraintsIn, readmeRegions, spliceRegions } from "./readme.ts";

const BOUNDARIES = `
depConstraints: [
    {
        sourceTag: "type:app",
        onlyDependOnLibsWithTags: [
            "type:integration",
            "type:config",
        ],
    },
    { sourceTag: "type:config", onlyDependOnLibsWithTags: [] },
    { sourceTag: "scope:shared", onlyDependOnLibsWithTags: ["scope:shared"] },
],
`;

const project = (root: string, tags: string[], description = ""): ProjectManifest => ({
    root,
    name: `@joinery/${root.split("/").at(-1) ?? ""}`,
    description,
    tags,
});

const PROJECTS = [
    project("apps/web", ["type:app"], "the site"),
    project("packages/configs", ["type:config", "scope:shared"]),
    project("apps/admin", ["type:app"], "the back office"),
];

const linesOf = (name: string): string[] =>
    readmeRegions(constraintsIn(BOUNDARIES), PROJECTS, ["packages", "apps"]).find(
        (region) => region.name === name,
    )?.lines ?? [];

describe("constraintsIn", () => {
    it("reads a constraint whose allowed list wraps over several lines", () => {
        expect(constraintsIn(BOUNDARIES)).toEqual([
            { tag: "type:app", allowed: ["type:integration", "type:config"] },
            { tag: "type:config", allowed: [] },
            { tag: "scope:shared", allowed: ["scope:shared"] },
        ]);
    });
});

describe("readmeRegions", () => {
    it("keeps type and scope tags in separate tables, in boundaries.ts order", () => {
        expect(linesOf("type-tags")).toEqual([
            "| Tag | May depend on | Who has it |",
            "| --- | --- | --- |",
            "| `type:app` | `type:integration`, `type:config` | `admin`, `web` |",
            "| `type:config` | nothing | `configs` |",
        ]);
        expect(linesOf("scope-tags")).toHaveLength(3);
    });

    it("lists layout roots in the given order with every name aligned to one column", () => {
        expect(linesOf("layout")).toEqual([
            "```",
            "packages/",
            "    configs/ @joinery/configs",
            "apps/",
            "    admin/   @joinery/admin — the back office",
            "    web/     @joinery/web — the site",
            "```",
        ]);
    });

    it("refuses to render when boundaries.ts yields no constraints", () => {
        expect(() => readmeRegions([], PROJECTS, ["apps"])).toThrow("No depConstraints parsed");
    });
});

describe("spliceRegions", () => {
    it("replaces only what sits between the markers, leaving the prose around them", () => {
        const readme = "intro\n<!-- docs:map:layout -->\nstale\n<!-- /docs:map:layout -->\noutro";

        expect(spliceRegions(readme, [{ name: "layout", lines: ["fresh"] }])).toBe(
            "intro\n<!-- docs:map:layout -->\nfresh\n<!-- /docs:map:layout -->\noutro",
        );
    });

    it("names the missing marker instead of dropping the region", () => {
        expect(() => spliceRegions("no markers", [{ name: "layout", lines: [] }])).toThrow(
            "<!-- docs:map:layout -->",
        );
    });
});
