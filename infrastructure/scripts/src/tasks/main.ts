import { randomUUID } from "node:crypto";
import { availableParallelism, loadavg } from "node:os";
import process from "node:process";
import type { Command } from "../shared/cli.ts";
import { appendTasks, currentBranch } from "../shared/adapters/usage.ts";
import { areaOf, callerOf, hookOf, isTimed } from "../shared/domain/usage.ts";
import { docsMapCheck, lastRun, nx } from "./adapters/nx.ts";
import { CHECK_STEPS, checkExit, loadOf, taskRowsOf, type RunContext } from "./domain/runs.ts";

/** The root commands that hand their Nx arguments through; `check` builds its own. */
const PASSTHROUGH = ["lint", "typecheck", "test", "build", "test:coverage", "unused:check"];

const contextOf = (trigger: string, run: string, startedAt: number): RunContext => ({
    at: new Date(startedAt).toISOString().slice(0, 10),
    run,
    trigger,
    hook: hookOf(process.env),
    caller: callerOf(process.env),
    area: areaOf(currentBranch()),
    load: loadOf(loadavg()[0] ?? 0, availableParallelism()),
});

const timedNx = (trigger: string, run: string, args: readonly string[]): number | null => {
    const startedAt = Date.now();
    const context = contextOf(trigger, run, startedAt);
    const status = nx(args);
    const nxRun = isTimed(process.env) ? lastRun() : undefined;

    if (nxRun) appendTasks(taskRowsOf(nxRun, context, startedAt));
    return status;
};

/** Everything after the subcommand, untouched: `run` has already split flags from positionals. */
const nxArguments = (): string[] => process.argv.slice(3);

const passthrough =
    (trigger: string): Command =>
    () => {
        process.exitCode = timedNx(trigger, randomUUID().slice(0, 8), nxArguments()) ?? 1;
    };

const check: Command = () => {
    const run = randomUUID().slice(0, 8);
    const steps: (number | null)[] = [];

    for (const step of CHECK_STEPS) {
        const status = timedNx("check", run, step);
        steps.push(status);
        if (status !== 0) break;
    }

    process.exitCode = checkExit(steps, docsMapCheck());
};

export const commands: Record<string, Command> = {
    check,
    ...Object.fromEntries(PASSTHROUGH.map((trigger) => [trigger, passthrough(trigger)])),
};
