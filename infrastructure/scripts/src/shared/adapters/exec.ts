import { execFileSync, spawnSync } from "node:child_process";
import { basename } from "node:path";
import { ExpectedError } from "../errors.ts";

// The 1 MiB default throws ENOBUFS on a large `git diff`.
const MAX_BUFFER_BYTES = 64 * 1024 * 1024;

/** Piping both streams keeps child errors and prompts inside this CLI's output handling. */
export const run = (command: string, args: string[]): string => {
    try {
        return execFileSync(command, args, {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
            maxBuffer: MAX_BUFFER_BYTES,
        }).trim();
    } catch (error) {
        // The usage row records which tool failed, and Node's error carries no name for it; only the
        // basename, since the row is published and a path can hold a home folder.
        if (error instanceof Error) Object.assign(error, { command: basename(command) });
        throw error;
    }
};

export interface Captured {
    status: number | null;
    stdout: string;
    stderr: string;
}

/** For a child whose non-zero exit is an answer to report, not an error to throw. */
export const capture = (command: string, args: string[]): Captured => {
    const { status, stdout, stderr } = spawnSync(command, args, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: MAX_BUFFER_BYTES,
    });

    return { status, stdout, stderr };
};

/** A `null` status means a signal ended the child — Ctrl+C out of a dev server, not a failure. */
export const inherit = (command: string, args: string[], cwd?: string): number | null =>
    spawnSync(command, args, { stdio: "inherit", cwd }).status;

/** A value starting with `-` is read as a flag, not a value — the injection shape SonarCloud flags. */
export const assertNotFlagLike = (value: string, field: string): string => {
    if (value.startsWith("-")) {
        throw new ExpectedError(
            `${field} can't start with "-" — it would be read as a flag, not a value: "${value}"`,
        );
    }
    return value;
};
