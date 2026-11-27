import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { inherit } from "../../shared/adapters/exec.ts";
import { at, repoRoot } from "../../shared/adapters/git.ts";
import type { NxRun } from "../domain/runs.ts";

export const nx = (args: readonly string[]): number | null =>
    inherit(at("node_modules", ".bin", "nx"), [...args], repoRoot());

export const docsMapCheck = (): number | null =>
    inherit("pnpm", ["-C", repoRoot(), "docs:map", "--check"]);

/** The cache folder is `~/.nx/<workspace hash>/cache` unless configured, so ask Nx for it. */
const cacheDir = (): string =>
    (createRequire(at("package.json"))("nx/src/utils/cache-directory") as { cacheDir: string })
        .cacheDir;

/** Fails open: a missing or unreadable `run.json` records nothing rather than breaking the run. */
export const lastRun = (): NxRun | undefined => {
    try {
        return JSON.parse(readFileSync(join(cacheDir(), "run.json"), "utf8")) as NxRun;
    } catch {
        return undefined;
    }
};
