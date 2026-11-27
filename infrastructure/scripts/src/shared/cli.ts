import process from "node:process";
import { out } from "./adapters/io.ts";
import { appendUsage, currentBranch, projectNames } from "./adapters/usage.ts";
import {
    dispatch,
    endingOf,
    invocation,
    parse,
    report as classifyError,
    type Args,
    type Ending,
} from "./domain/cli.ts";
import { areaOf, callerOf, flagLabels, isRecorded, scriptOf, targetOf } from "./domain/usage.ts";

export type { Args } from "./domain/cli.ts";

export type Command = (args: Args) => void | Promise<void>;

/** Read per call so importing a module cannot freeze the flag's value. */
export const flag = (name: string): boolean => process.argv.includes(`--${name}`);

// `pnpm docs:map --check | tee log` truncated with `process.exit` — a write to a pipe is async in Node.
export const fail = (message: string): void => {
    out.error(message);
    process.exitCode = 1;
};

const report = (error: unknown): void => {
    const result = classifyError(error);
    if (result.cancelled) {
        out.cancelled(result.message);
        return;
    }

    fail(result.message);
};

const execute = async (
    commands: Command | Record<string, Command>,
    args: Args,
): Promise<Ending> => {
    try {
        if (typeof commands === "function") {
            await commands(args);
        } else {
            const result = dispatch(
                commands,
                args,
                invocation(process.argv[1] ?? "", process.cwd()),
            );
            if (!result.matched) {
                fail(result.usage);
                return { outcome: "usage", error: "" };
            }

            await result.command({
                flags: result.args.flags,
                positionals: result.args.positionalsWithoutCommandName,
            });
        }
    } catch (error) {
        report(error);
        return endingOf(error);
    }

    // A command that sets a failing exit code without throwing has reported what it found.
    return { outcome: Number(process.exitCode ?? 0) === 0 ? "ok" : "finding", error: "" };
};

/** The shell's code for a process ended by Ctrl+C. */
const INTERRUPTED = 130;

const record = (
    commands: Command | Record<string, Command>,
    args: Args,
    startedAt: number,
    exit: number,
    ending: Ending,
): void => {
    const script = scriptOf(process.argv[1] ?? "");
    if (!isRecorded(process.env, script)) return;

    const [first] = args.positionals;
    const isSubcommand =
        typeof commands !== "function" && first !== undefined && Object.hasOwn(commands, first);

    appendUsage({
        // The repo is public, so a time of day would publish when its owner works.
        at: new Date(startedAt).toISOString().slice(0, 10),
        script,
        command: isSubcommand ? first : "",
        target: targetOf(args.positionals, projectNames()),
        flags: flagLabels(args.flags),
        area: areaOf(currentBranch()),
        caller: callerOf(process.env),
        exit: String(exit),
        outcome: ending.outcome,
        error: ending.error,
        ms: String(Date.now() - startedAt),
    });
};

const INTERRUPTED_ENDING: Ending = { outcome: "interrupted", error: "" };

export const run = async (commands: Command | Record<string, Command>): Promise<void> => {
    const startedAt = Date.now();
    const args = parse(process.argv.slice(2));

    // Without this a Ctrl+C on `pnpm dev` kills the process before the row below is written.
    const interrupt = (): void => {
        record(commands, args, startedAt, INTERRUPTED, INTERRUPTED_ENDING);
        process.exit(INTERRUPTED);
    };
    process.once("SIGINT", interrupt);

    const ending = await execute(commands, args);

    // A SIGINT that arrived while `spawnSync` blocked the loop is delivered on the next tick.
    await new Promise((resolve) => setImmediate(resolve));
    process.off("SIGINT", interrupt);
    record(commands, args, startedAt, Number(process.exitCode ?? 0), ending);
};
