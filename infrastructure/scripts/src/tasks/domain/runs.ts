import type { TaskRow } from "../../shared/domain/usage.ts";

/** The part of Nx's `<cacheDir>/run.json` read here, which Nx rewrites after every command. */
export interface NxRun {
    run: { startTime: string };
    tasks: {
        target: string;
        projectName: string;
        startTime?: string;
        endTime?: string;
        cacheStatus: string;
        status: number;
    }[];
}

export type RunContext = Pick<
    TaskRow,
    "at" | "run" | "trigger" | "hook" | "caller" | "area" | "load"
>;

/** Every project is `@joinery/<folder>`, and the scripts log names projects by folder. */
const projectOf = (name: string): string => name.replace(/^@joinery\//, "");

const msBetween = (start?: string, end?: string): string =>
    start && end ? String(Date.parse(end) - Date.parse(start)) : "";

/** An older `run.json` belongs to an earlier command, so it yields no rows. */
export const taskRowsOf = (nxRun: NxRun, context: RunContext, since: number): TaskRow[] => {
    if (Date.parse(nxRun.run.startTime) < since) return [];

    return nxRun.tasks.map((task) => ({
        ...context,
        project: projectOf(task.projectName),
        target: task.target,
        cache: task.cacheStatus === "cache-miss" ? "miss" : "hit",
        exit: String(task.status),
        ms: msBetween(task.startTime, task.endTime),
    }));
};

/** The 1-minute load average per core, so a slow run beside three other worktrees reads as one. */
export const loadOf = (loadAverage: number, cores: number): string =>
    (loadAverage / Math.max(cores, 1)).toFixed(2);

/** `check` runs these two Nx steps, then `docs:map --check`, and fails if any of them did. */
export const CHECK_STEPS: readonly (readonly string[])[] = [
    ["affected", "--base=master", "-t", "nuxt-prepare", "--outputStyle=static-failures-only"],
    [
        "affected",
        "--base=master",
        "-t",
        "eslint:lint",
        "typecheck",
        "test",
        "--outputStyle=static-failures-only",
    ],
];

/** Same as the shell's `a && b; s=$?; c || s=1`: a failed first step skips the second, never `c`. */
export const checkExit = (steps: readonly (number | null)[], docs: number | null): number => {
    const failed = steps.find((status) => status !== 0);
    if (failed !== undefined) return failed ?? 1;
    return docs === 0 ? 0 : 1;
};
