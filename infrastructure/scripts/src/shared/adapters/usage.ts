import { appendFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { PROJECT_ROOTS } from "../domain/layout.ts";
import { lineOf, TASK_COLUMNS, toLine, type TaskRow, type UsageRow } from "../domain/usage.ts";
import { at, git } from "./git.ts";

/** Inside the common `.git`, so every worktree shares one buffer and the working tree stays clean. */
export const usageBufferPath = (log = "scripts"): string =>
    join(git("rev-parse", "--path-format=absolute", "--git-common-dir"), "telemetry", `${log}.csv`);

/** Fails open: a script must never break because its usage could not be written. */
const append = (log: string, lines: string[]): void => {
    if (lines.length === 0) return;

    try {
        const file = usageBufferPath(log);
        mkdirSync(dirname(file), { recursive: true });
        appendFileSync(file, lines.map((line) => `${line}\n`).join(""));
    } catch {
        // No git checkout, a read-only disk: nothing to record into.
    }
};

export const appendUsage = (row: UsageRow): void => append("scripts", [toLine(row)]);

export const appendTasks = (rows: TaskRow[]): void =>
    append(
        "tasks",
        rows.map((row) => lineOf(TASK_COLUMNS, row)),
    );

export const currentBranch = (): string => {
    try {
        return git("branch", "--show-current");
    } catch {
        return "";
    }
};

export const projectNames = (): Set<string> => {
    try {
        return new Set(
            PROJECT_ROOTS.flatMap((root) =>
                readdirSync(at(root), { withFileTypes: true })
                    .filter((entry) => entry.isDirectory())
                    .map((entry) => entry.name),
            ),
        );
    } catch {
        return new Set();
    }
};
