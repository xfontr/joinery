import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * A missing or half-written artifact resolves to null rather than throwing: `.report/` is
 * gitignored, so "never collected" is the state of a fresh clone and every page renders it.
 */
const readJson = async <T>(path: string): Promise<T | null> => {
    try {
        return JSON.parse(await readFile(path, "utf8")) as T;
    } catch {
        return null;
    }
};

/**
 * The directory is resolved in `nuxt.config.ts`: from `import.meta.url` here it became
 * `.output/server/.report` once Nitro bundled this module, and prerender baked an empty dashboard.
 */
export const readArtifact = <T>(name: string): Promise<T | null> =>
    readJson<T>(resolve(useRuntimeConfig().snapshotDir, `${name}.json`));
