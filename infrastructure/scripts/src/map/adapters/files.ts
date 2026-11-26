import { readdirSync, readFileSync, statSync, writeFileSync, type Dirent } from "node:fs";
import { join, relative } from "node:path";
import { at, repoRoot } from "../../shared/adapters/git.ts";
import { PROJECT_ROOTS } from "../../shared/domain/layout.ts";
import type { Doc, ProjectScripts } from "../domain/capabilities.ts";
import { BOUNDARIES_PATH, README_PATH, type ProjectManifest } from "../domain/readme.ts";

const read = (path: string): string => readFileSync(path, "utf8");

const readJson = (path: string): Record<string, unknown> =>
    JSON.parse(read(path)) as Record<string, unknown>;

const scriptNames = (pkg: Record<string, unknown>): string[] => Object.keys(pkg.scripts ?? {});

const entriesIn = (path: string, keep: (entry: Dirent) => boolean): string[] => {
    try {
        return readdirSync(path, { withFileTypes: true })
            .filter(keep)
            .map((entry) => entry.name);
    } catch {
        return [];
    }
};

const dirsIn = (path: string): string[] => entriesIn(path, (entry) => entry.isDirectory());

const filesIn = (path: string): string[] => entriesIn(path, (entry) => entry.isFile());

const nameField = (text: string): string | undefined =>
    /^name:[^\S\n]*(\S.*)$/m.exec(text)?.[1]?.trim();

export const rootScripts = (): string[] => scriptNames(readJson(at("package.json")));

export const projectManifests = (): (ProjectManifest & { scripts: string[] })[] =>
    PROJECT_ROOTS.flatMap((top) =>
        dirsIn(at(top)).flatMap((dir) => {
            try {
                const pkg = readJson(at(top, dir, "package.json"));
                const nx = (pkg.nx ?? {}) as { tags?: string[] };
                return [
                    {
                        root: `${top}/${dir}`,
                        name: String(pkg.name),
                        description: typeof pkg.description === "string" ? pkg.description : "",
                        tags: nx.tags ?? [],
                        scripts: scriptNames(pkg),
                    },
                ];
            } catch {
                return [];
            }
        }),
    );

export const projectScripts = (): ProjectScripts[] =>
    projectManifests().map(({ root, name, scripts }) => ({ root, name, scripts }));

export const hookNames = (): string[] =>
    filesIn(at(".husky")).filter((name) => !name.startsWith("_"));

export const workflowFiles = (): { file: string; name: string }[] =>
    filesIn(at(".github", "workflows"))
        .filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"))
        .map((file) => ({
            file,
            name: nameField(read(at(".github", "workflows", file))) ?? file,
        }));

const skillsUnder = (dir: string): { source: string; name: string }[] =>
    dirsIn(at(dir))
        .map((skill) => `${dir}/${skill}/SKILL.md`)
        .filter((source) => {
            try {
                statSync(at(source));
                return true;
            } catch {
                return false;
            }
        })
        .map((source) => ({
            source,
            name: nameField(read(at(source))) ?? source,
        }));

export const skillFiles = (): { source: string; name: string }[] => skillsUnder(".claude/skills");

/** Ignore linked worktrees or duplicate docs would make the map branch-dependent. */
const IGNORED_DIRS = new Set([
    "node_modules",
    ".git",
    ".nx",
    "dist",
    ".output",
    ".nuxt",
    "worktrees",
]);

const walkMarkdown = (dir: string, found: string[] = []): string[] => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const child = join(dir, entry.name);

        if (entry.isDirectory() && !IGNORED_DIRS.has(entry.name)) {
            walkMarkdown(child, found);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
            found.push(relative(repoRoot(), child));
        }
    }
    return found;
};

export const MAP_PATH = "docs/FEATURES.md";

/** Two deliberate exclusions from the markdown scan — see ./README.md#picking-the-doc. */
export const docs = (): Doc[] =>
    walkMarkdown(repoRoot())
        .filter((path) => !path.endsWith("CHANGELOG.md") && path !== MAP_PATH)
        .map((path) => ({ path, text: read(at(path)) }));

export const readMap = (): string => {
    try {
        return read(at(MAP_PATH));
    } catch {
        return "";
    }
};

export const writeMap = (markdown: string): void => writeFileSync(at(MAP_PATH), markdown);

export const readBoundaries = (): string => read(at(BOUNDARIES_PATH));

export const readReadme = (): string => read(at(README_PATH));

export const writeReadme = (markdown: string): void => writeFileSync(at(README_PATH), markdown);
