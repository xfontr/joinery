import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { at } from "../../shared/adapters/git.ts";
import { PROJECT_ROOTS } from "../../shared/domain/layout.ts";
import type { PackageSource } from "../domain/contracts.ts";
import type { NuxtSources } from "../domain/sides.ts";
import type { WorkflowSource } from "../domain/workflows.ts";

const GENERATED = new Set([".nuxt", ".output", "node_modules", "coverage", "dist", "public"]);

const filesUnder = (
    directory: string,
    root: string,
    found: string[] = [],
    skip: ReadonlySet<string> = new Set(),
): string[] => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);

        if (entry.isDirectory()) {
            if (!skip.has(entry.name)) filesUnder(path, root, found, skip);
        } else if (entry.isFile()) {
            found.push(relative(root, path).replaceAll("\\", "/"));
        }
    }

    return found;
};

const directoriesIn = (root: string): string[] =>
    readdirSync(at(root), { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b));

const parse = (path: string): { manifest: unknown; readError?: string } => {
    try {
        return { manifest: JSON.parse(readFileSync(path, "utf8")) as unknown };
    } catch (error) {
        return {
            manifest: undefined,
            readError: error instanceof Error ? error.message : String(error),
        };
    }
};

export const readPackages = (): PackageSource[] =>
    directoriesIn("packages").map((directory) => {
        const packageRoot = at("packages", directory);

        return {
            directory,
            files: filesUnder(packageRoot, packageRoot),
            ...parse(join(packageRoot, "package.json")),
        };
    });

/** Repo-relative roots of every workspace project, e.g. `apps/huella-legal`. */
export const projectRoots = (): string[] =>
    PROJECT_ROOTS.flatMap((root) =>
        directoriesIn(root)
            .map((directory) => `${root}/${directory}`)
            .filter((project) => existsSync(at(project, "package.json"))),
    );

/** The root manifest and every project's, repo-relative; one that fails to parse is left out. */
export const readManifests = (): { path: string; manifest: unknown }[] =>
    ["package.json", ...projectRoots().map((project) => `${project}/package.json`)].flatMap(
        (path) => {
            const { manifest, readError } = parse(at(path));
            return readError === undefined ? [{ path, manifest }] : [];
        },
    );

export const readTableSources = (): { boundaries: string; readme: string } => ({
    boundaries: readFileSync(at("packages/configs/src/eslint/lib/boundaries.ts"), "utf8"),
    readme: readFileSync(at("README.md"), "utf8"),
});

/** Every `.ts` and `.vue` source of each app with a `nuxt.config.ts`, generated output left out. */
export const readNuxtSources = (): NuxtSources[] =>
    projectRoots()
        .filter((project) => existsSync(at(project, "nuxt.config.ts")))
        .map((app) => {
            const root = at(app);
            const files = filesUnder(root, root, [], GENERATED)
                .filter((path) => /\.(?:ts|vue)$/.test(path))
                .map((path) => ({ path, text: readFileSync(join(root, path), "utf8") }));
            return { app, files };
        });

export const readWorkflows = (): WorkflowSource[] =>
    readdirSync(at(".github/workflows"))
        .filter((file) => /\.ya?ml$/.test(file))
        .map((file) => ({ file, text: readFileSync(at(".github/workflows", file), "utf8") }));
