import { describe, expect, it } from "vitest";
import { checkExit, loadOf, taskRowsOf, type NxRun, type RunContext } from "./runs.ts";

const CONTEXT = {
    at: "2026-11-27",
    run: "a1b2c3d4",
    trigger: "check",
    hook: "pre-push",
    caller: "human",
    area: "repo",
    load: "0.50",
} satisfies RunContext;

const NX_RUN = {
    run: { startTime: "2026-11-27T09:30:00.000Z" },
    tasks: [
        {
            target: "test",
            projectName: "@joinery/scripts",
            startTime: "2026-11-27T09:30:00.100Z",
            endTime: "2026-11-27T09:30:08.305Z",
            cacheStatus: "cache-miss",
            status: 0,
        },
        {
            target: "typecheck",
            projectName: "@joinery/configs",
            startTime: "2026-11-27T09:30:00.100Z",
            endTime: "2026-11-27T09:30:00.104Z",
            cacheStatus: "local-cache-hit",
            status: 0,
        },
    ],
} satisfies NxRun;

describe("taskRowsOf", () => {
    it("times each task and marks a cache hit, whose near-zero time isn't a real run", () => {
        const rows = taskRowsOf(NX_RUN, CONTEXT, Date.parse("2026-11-27T09:29:59.900Z"));

        expect(rows).toEqual([
            {
                ...CONTEXT,
                project: "scripts",
                target: "test",
                cache: "miss",
                exit: "0",
                ms: "8205",
            },
            {
                ...CONTEXT,
                project: "configs",
                target: "typecheck",
                cache: "hit",
                exit: "0",
                ms: "4",
            },
        ]);
    });

    it("records nothing from a run.json an earlier command left behind", () => {
        expect(taskRowsOf(NX_RUN, CONTEXT, Date.parse("2026-11-27T09:31:00.000Z"))).toEqual([]);
    });

    it("leaves the time blank for a task Nx never timed", () => {
        const [task] = NX_RUN.tasks;
        const run = { ...NX_RUN, tasks: [{ ...task!, startTime: undefined }] };

        expect(taskRowsOf(run, CONTEXT, 0)[0]?.ms).toBe("");
    });
});

describe("loadOf", () => {
    it("divides the load by the cores, so the figure means the same on any machine", () => {
        expect(loadOf(6, 12)).toBe("0.50");
        expect(loadOf(3, 0)).toBe("3.00");
    });
});

describe("checkExit", () => {
    it("fails with the first failed Nx step's code even when docs:map passes", () => {
        expect(checkExit([0, 1], 0)).toBe(1);
        expect(checkExit([2], 0)).toBe(2);
    });

    it("fails on drift alone, and on a step a signal ended", () => {
        expect(checkExit([0, 0], 1)).toBe(1);
        expect(checkExit([0, null], 0)).toBe(1);
        expect(checkExit([0, 0], 0)).toBe(0);
    });
});
