import { describe, expect, it } from "vitest";
import { readProject } from "./project.ts";
import { projectMap } from "./projectMap.ts";
import { projectView } from "./projectView.ts";
import { readTemplate } from "./template.ts";
import type { SnapshotIssue } from "./types/SnapshotIssue.ts";

const TEMPLATE = {
    id: "website-rebuild",
    title: "Website rebuild",
    stages: [
        { id: "discovery", title: "Discovery" },
        { id: "build", title: "Build" },
    ],
    capabilities: [
        { id: "audit", stage: "discovery", title: "Content audit" },
        { id: "page", stage: "build", title: "Article page", dependsOn: ["audit"] },
        { id: "search", stage: "build", title: "Search", dependsOn: ["page"] },
        { id: "comments", stage: "build", title: "Comments", optional: true, default: false },
    ],
};

const PROJECT = { id: "site", title: "Site", template: "website-rebuild", milestone: "Site" };

const issue = (number: number, caps: string[], overrides: Partial<SnapshotIssue> = {}) =>
    ({
        number,
        title: `#${number}`,
        url: "",
        state: "closed",
        reason: "completed",
        caps,
        createdAt: "2026-10-01T00:00:00Z",
        closedAt: "2026-11-01T00:00:00Z",
        activity: [],
        blockedBy: [],
        branch: false,
        pr: false,
        owner: false,
        complexity: null,
        ...overrides,
    }) satisfies SnapshotIssue;

const mapOf = (issues: SnapshotIssue[] | null) =>
    projectMap(
        projectView(
            readProject(PROJECT).project,
            readTemplate(TEMPLATE).template,
            issues && {
                syncedAt: "2026-11-09T00:00:00Z",
                milestone: "Site",
                issues,
                noMilestone: [],
            },
            null,
        ),
    );

const toneOf = (map: ReturnType<typeof mapOf>, id: string) =>
    map.nodes.find((node) => node.id === id)?.tone;

describe("projectMap", () => {
    it("leaves a switched-off block off the map", () => {
        expect(mapOf([]).nodes.map((node) => node.id)).not.toContain("comments");
    });

    it("tells a finished block from a startable one and from one still waiting", () => {
        const map = mapOf([issue(1, ["audit"])]);

        expect(toneOf(map, "audit")).toBe("done");
        expect(toneOf(map, "page")).toBe("moving");
        expect(toneOf(map, "search")).toBe("waiting");
        expect(map.blocks).toEqual({ done: 1, moving: 1, total: 3 });
    });

    it("draws one curve from each need to the block that needs it", () => {
        expect(mapOf([]).edges.map((edge) => edge.id)).toEqual(["audit-page", "page-search"]);
    });

    it("puts each stage in its own column, in the template's order", () => {
        expect(mapOf([]).stages.map((stage) => stage.blocks.map((block) => block.id))).toEqual([
            ["audit"],
            ["page", "search"],
        ]);
    });

    it("counts no tickets for a project never synced, rather than zero of zero", () => {
        expect(mapOf(null).tickets).toBeNull();
    });

    it("leaves a ticket closed as not planned out of the count", () => {
        const map = mapOf([
            issue(1, ["audit"]),
            issue(2, ["page"], { state: "open", reason: null, closedAt: null }),
            issue(3, ["page"], { reason: "not_planned" }),
        ]);

        expect(map.tickets).toEqual({ closed: 1, total: 2 });
    });
});
