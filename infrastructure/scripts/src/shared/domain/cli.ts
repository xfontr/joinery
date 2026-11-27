import { relative } from "node:path";
import { CancelledError, ExpectedError } from "../errors.ts";

export interface Args {
    flags: ReadonlySet<string>;
    positionals: string[];
}

/** How a run ended, recorded in place of a bare exit code so a refusal never reads as a crash. */
type Outcome = "ok" | "finding" | "refused" | "usage" | "crash" | "cancelled" | "interrupted";

export interface Ending {
    outcome: Outcome;
    /** Set for a crash only, and only to a kind such as `gh:exit` or `ENOENT`: rows are public. */
    error: string;
}

interface ErrorReport {
    cancelled: boolean;
    message: string;
}

interface MatchedDispatch<T> {
    matched: true;
    command: T;
    args: {
        flags: ReadonlySet<string>;
        positionalsWithoutCommandName: string[];
    };
}

interface UnmatchedDispatch {
    matched: false;
    usage: string;
}

type Dispatch<T> = MatchedDispatch<T> | UnmatchedDispatch;

export const parse = (argv: string[]): Args => ({
    flags: new Set(argv.filter((arg) => arg.startsWith("--")).map((arg) => arg.slice(2))),
    positionals: argv.filter((arg) => !arg.startsWith("--")),
});

export const optionValue = (flags: ReadonlySet<string>, name: string): string | undefined => {
    const prefix = `${name}=`;
    for (const flag of flags)
        if (flag.startsWith(prefix)) return flag.slice(prefix.length) || undefined;
    return undefined;
};

export const dispatch = <T>(
    commands: Record<string, T>,
    args: Args,
    commandInvocation: string,
): Dispatch<T> => {
    const [name, ...positionalsWithoutCommandName] = args.positionals;
    const command = name === undefined ? undefined : commands[name];

    if (!command)
        return {
            matched: false,
            usage: `Usage: ${commandInvocation} <${Object.keys(commands).join("|")}>`,
        };

    return {
        matched: true,
        command,
        args: { flags: args.flags, positionalsWithoutCommandName },
    };
};

export const invocation = (entry: string, cwd: string): string => {
    const path = relative(cwd, entry);
    return `node ${path && !path.startsWith("..") ? path : entry}`;
};

export const detailOf = (error: unknown): string | undefined =>
    (error as { stderr?: Buffer | string }).stderr?.toString().trim() || undefined;

export const report = (error: unknown): ErrorReport => {
    if (error instanceof CancelledError) return { cancelled: true, message: error.message };
    if (error instanceof ExpectedError) return { cancelled: false, message: error.message };

    const stack = error instanceof Error ? (error.stack ?? error.message) : String(error);
    const detail = detailOf(error);
    // Node already appends stderr to an execFileSync error's message, and so to its stack.
    return {
        cancelled: false,
        message: detail && !stack.includes(detail) ? `${stack}\n${detail}` : stack,
    };
};

/** `exec.run` tags a failed child with the command it ran, which is the useful part of the kind. */
export const errorKindOf = (error: unknown): string => {
    const { code, command } = (error ?? {}) as { code?: unknown; command?: unknown };
    const systemCode = typeof code === "string" ? code : undefined;

    if (typeof command === "string") return `${command}:${systemCode ?? "exit"}`;
    if (systemCode) return systemCode;
    return error instanceof Error ? error.name : typeof error;
};

export const endingOf = (error: unknown): Ending => {
    if (error instanceof CancelledError) return { outcome: "cancelled", error: "" };
    if (error instanceof ExpectedError) return { outcome: "refused", error: "" };
    return { outcome: "crash", error: errorKindOf(error) };
};
