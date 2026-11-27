import type { CiTimings } from "#layers/snapshot/shared/types/CiTimings.ts";
import { durationsOf } from "#layers/telemetry/shared/usage.ts";
import { run } from "../lib/run.ts";

/** Enough runs for a median that one slow runner can't move, without a slow collect. */
const RUNS = 20;

interface GhTimed {
    name: string;
    startedAt?: string;
    completedAt?: string;
}

export interface GhJob extends GhTimed {
    steps: (GhTimed & { conclusion: string })[];
}

const msOf = ({ startedAt, completedAt }: GhTimed): number | undefined =>
    startedAt && completedAt ? Date.parse(completedAt) - Date.parse(startedAt) : undefined;

/**
 * What a step runs, or `undefined` for the checkout, install and cache steps around it. An Nx step
 * is named by its targets, since its `--base`/`--head` arguments are the same in every step.
 */
export const stepLabel = (name: string): string | undefined => {
    const command = /^Run (pnpm .+)$/.exec(name)?.[1];
    if (!command) return undefined;

    const targets = / -t (.+)$/.exec(command)?.[1];
    return targets ? `nx ${targets}` : command;
};

export const summarizeCi = (runs: GhJob[][]): CiTimings => {
    const jobs: Record<string, number[]> = {};
    const steps: Record<string, number[]> = {};
    const add = (lists: Record<string, number[]>, key: string, ms: number | undefined): void => {
        if (ms !== undefined) lists[key] = [...(lists[key] ?? []), ms];
    };

    for (const job of runs.flat()) {
        if (job.steps.length === 0) continue;
        add(jobs, job.name, msOf(job));
        for (const step of job.steps) {
            const label = stepLabel(step.name);
            if (label && step.conclusion === "success") add(steps, label, msOf(step));
        }
    }

    const summarize = (lists: Record<string, number[]>) =>
        Object.fromEntries(
            Object.entries(lists).flatMap(([key, values]) => {
                const durations = durationsOf(values);
                return durations ? [[key, durations]] : [];
            }),
        );

    return { runs: runs.length, jobs: summarize(jobs), steps: summarize(steps) };
};

/** Fails open: a clone without `gh`, or offline, collects everything else. */
export const collectCiTimings = async (): Promise<CiTimings | null> => {
    try {
        const ids = JSON.parse(
            await run("gh", [
                "run",
                "list",
                "--workflow",
                "ci.yml",
                "--status",
                "success",
                "--limit",
                String(RUNS),
                "--json",
                "databaseId",
            ]),
        ) as { databaseId: number }[];

        const runs = await Promise.all(
            ids.map(async ({ databaseId }) => {
                const view = JSON.parse(
                    await run("gh", ["run", "view", String(databaseId), "--json", "jobs"]),
                ) as { jobs: GhJob[] };
                return view.jobs;
            }),
        );

        return summarizeCi(runs);
    } catch {
        return null;
    }
};
