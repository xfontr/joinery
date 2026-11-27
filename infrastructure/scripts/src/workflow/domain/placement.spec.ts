import { describe, expect, it } from "vitest";
import { readMap } from "./filing.ts";
import { unplaced } from "./placement.ts";
import type { Snapshot, SnapshotIssue } from "./snapshot.ts";

const TEMPLATE = {
    groups: [{ id: "blog", optional: true, default: true }],
    capabilities: [
        { id: "article-page", title: "Article page", group: "blog" },
        { id: "comments", title: "Comments", optional: true, default: false },
    ],
};

const MAP = readMap(TEMPLATE, { milestone: "Site" });

const ticket = (
    number: number,
    caps: string[],
    state: "open" | "closed" = "open",
): SnapshotIssue => ({
    number,
    title: `T${number}`,
    url: "",
    state,
    reason: state === "closed" ? "completed" : null,
    caps,
    createdAt: "2026-10-01T00:00:00Z",
    closedAt: null,
    activity: [],
    blockedBy: [],
    branch: false,
    pr: false,
    owner: false,
    complexity: null,
});

const snapshot = (issues: SnapshotIssue[], noMilestone: SnapshotIssue[] = []): Snapshot => ({
    syncedAt: "2026-11-01T00:00:00Z",
    milestone: "Site",
    issues,
    noMilestone,
});

describe("unplaced", () => {
    it("places a ticket labelled with a capability that's on", () => {
        expect(unplaced(MAP, snapshot([ticket(1, ["article-page"])]))).toEqual([]);
    });

    it.each([
        [[], "no cap: label"],
        [["blog"], "blog is a group; label one of its capabilities instead"],
        [["ghost"], "unknown capability ghost"],
        [["comments"], "its capability is switched off"],
    ])("names why a ticket labelled %j can't be placed", (caps, reason) => {
        expect(unplaced(MAP, snapshot([ticket(1, caps)]))).toEqual([`#1 T1: ${reason}`]);
    });

    it("leaves a closed ticket on a switched-off capability alone, since it's history", () => {
        expect(unplaced(MAP, snapshot([ticket(1, ["comments"], "closed")]))).toEqual([]);
    });

    it("flags an area ticket outside the milestone only while work is left", () => {
        const stray = ticket(9, []);

        expect(unplaced(MAP, snapshot([], [stray]))).toEqual(["#9 T9: not in Site"]);
        expect(unplaced(MAP, snapshot([ticket(1, ["article-page"], "closed")], [stray]))).toEqual(
            [],
        );
    });
});
