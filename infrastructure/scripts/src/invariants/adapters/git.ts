import { assertNotFlagLike, capture } from "../../shared/adapters/exec.ts";
import { at } from "../../shared/adapters/git.ts";
import { ExpectedError } from "../../shared/errors.ts";

/** A missing ref would otherwise read as "every file is new" and skip the version check silently. */
export const assertCommit = (ref: string): string => {
    const { status } = capture("git", [
        "-C",
        at(),
        "rev-parse",
        "--verify",
        "--quiet",
        `${assertNotFlagLike(ref, "--base")}^{commit}`,
    ]);
    if (status !== 0) throw new ExpectedError(`--base=${ref} is not a commit in this repository.`);

    return ref;
};

/** The manifest at `ref`, or undefined when the file did not exist there. */
export const manifestAt = (ref: string, path: string): unknown => {
    const { status, stdout } = capture("git", ["-C", at(), "show", `${ref}:${path}`]);
    if (status !== 0) return undefined;

    try {
        return JSON.parse(stdout) as unknown;
    } catch {
        return undefined;
    }
};
