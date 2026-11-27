import { describe, expect, it } from "vitest";
import { stepLabel, summarizeCi, type GhJob } from "./ciTimings.ts";

const E2E_STEP = 'Run pnpm exec nx affected --base="$NX_BASE" --head="$NX_HEAD" -t test:e2e';

const job = (minutes: number, stepMinutes: number, conclusion = "success"): GhJob => ({
    name: "e2e",
    startedAt: "2026-11-26T16:00:00Z",
    completedAt: `2026-11-26T16:${String(minutes).padStart(2, "0")}:00Z`,
    steps: [
        {
            name: "Run actions/checkout@3d3c42e5",
            conclusion: "success",
            startedAt: "2026-11-26T16:00:00Z",
            completedAt: "2026-11-26T16:00:02Z",
        },
        {
            name: E2E_STEP,
            conclusion,
            startedAt: "2026-11-26T16:00:00Z",
            completedAt: `2026-11-26T16:${String(stepMinutes).padStart(2, "0")}:00Z`,
        },
    ],
});

describe("stepLabel", () => {
    it("names an Nx step by its targets, since every step's base and head are the same", () => {
        expect(stepLabel(E2E_STEP)).toBe("nx test:e2e");
        expect(stepLabel("Run pnpm unused:check")).toBe("pnpm unused:check");
    });

    it("leaves out the checkout, install and cache steps around the work", () => {
        expect(stepLabel("Run actions/checkout@3d3c42e5")).toBeUndefined();
        expect(stepLabel("Run ./.github/actions/install")).toBeUndefined();
        expect(stepLabel("Post Run actions/cache@55cc8345")).toBeUndefined();
    });
});

describe("summarizeCi", () => {
    it("times each job and each pnpm step across runs", () => {
        const ci = summarizeCi([[job(8, 7)], [job(6, 5)]]);

        expect(ci.runs).toBe(2);
        expect(ci.jobs.e2e).toEqual({ runs: 2, medianMs: 360_000, p90Ms: 480_000 });
        expect(ci.steps["nx test:e2e"]).toEqual({ runs: 2, medianMs: 300_000, p90Ms: 420_000 });
    });

    // A skipped step finishes in a second and would read as a fast one.
    it("leaves out a step that didn't succeed and a job that ran no steps", () => {
        const ci = summarizeCi([[job(8, 7, "skipped"), { name: "master-health", steps: [] }]]);

        expect(ci.steps).toEqual({});
        expect(Object.keys(ci.jobs)).toEqual(["e2e"]);
    });
});
