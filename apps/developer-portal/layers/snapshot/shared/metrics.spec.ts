import { describe, expect, it } from "vitest";
import { specTotal, unreleased } from "./metrics.ts";
import type { ProjectMetrics } from "./types/ProjectMetrics.ts";

const project = (
    root: string,
    specs: number,
    unreleasedCommits: number | null = null,
): ProjectMetrics => ({
    name: root,
    root,
    specs,
    commits: null,
    commitsLastTwoWeeks: null,
    coverageLinesPct: null,
    unreleasedCommits,
    currentVersion: null,
    hasChangelog: false,
});

describe("specTotal", () => {
    it("adds every project's spec files", () => {
        expect(specTotal([project("apps/blog", 12), project("packages/content", 30)])).toBe(42);
    });

    it("has no total to state when nothing was collected, rather than claiming zero", () => {
        expect(specTotal(undefined)).toBeNull();
        expect(specTotal([])).toBeNull();
    });
});

describe("unreleased", () => {
    it("lists only projects with commits since their release, the furthest behind first", () => {
        const behind = unreleased([
            project("packages/content", 0, 2),
            project("apps/blog", 0, 0),
            project("packages/i18n", 0, 9),
            project("apps/new", 0, null),
        ]);

        expect(behind.map((item) => item.root)).toEqual(["packages/i18n", "packages/content"]);
    });
});
