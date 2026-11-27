import { describe, expect, it } from "vitest";
import { toBadges } from "./badges.ts";
import type { CoverageArtifact } from "#layers/snapshot/shared/types/CoverageArtifact.ts";
import type { DepsArtifact } from "#layers/snapshot/shared/types/DepsArtifact.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";

const NONE = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };

const DEPS = {
    generatedAt: "2026-11-18T10:00:00Z",
    vulnerabilities: { ...NONE, low: 2 },
    totalDependencies: 10,
    advisories: [],
    outdated: null,
} satisfies DepsArtifact;

const NOTHING = { deps: null, coverage: null, metrics: null };

describe("toBadges", () => {
    it("reads every figure from its artifact", () => {
        const advisory = { id: 1 } as unknown as DepsArtifact["advisories"][number];

        expect(
            toBadges({
                deps: { ...DEPS, advisories: [advisory, advisory] },
                coverage: {
                    generatedAt: DEPS.generatedAt,
                    totals: { lines: 81, statements: 0, functions: 0, branches: 0 },
                    report: false,
                    projects: [],
                } satisfies CoverageArtifact,
                metrics: {
                    generatedAt: "2026-11-18T10:00:00Z",
                    commit: "abc1234def",
                    branch: "master",
                    projects: [],
                    conventionalCommitRate: null,
                    commitsSinceLastRelease: null,
                } satisfies MetricsArtifact,
            }),
        ).toEqual({
            advisories: 2,
            worstSeverity: "low",
            lineCoverage: 81,
            collected: { branch: "master", commit: "abc1234def", at: "2026-11-18T10:00:00Z" },
        });
    });

    it("names the most severe advisory, not the most common one", () => {
        const deps = { ...DEPS, vulnerabilities: { ...NONE, low: 9, high: 1 } };

        expect(toBadges({ ...NOTHING, deps })).toMatchObject({ worstSeverity: "high" });
    });

    it("answers a never-collected snapshot with empty figures rather than throwing", () => {
        expect(toBadges(NOTHING)).toEqual({
            advisories: 0,
            worstSeverity: null,
            lineCoverage: null,
            collected: null,
        });
    });
});
