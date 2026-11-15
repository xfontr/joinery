import type { Finding } from "./findings.ts";

const BOUNDARIES_PATH = "packages/configs/src/eslint/lib/boundaries.ts";
const README_PATH = "README.md";

/** Every `sourceTag:` in the enforced copy of the tag table. */
export const tagsInBoundaries = (source: string): string[] =>
    [...source.matchAll(/sourceTag:\s*"([^"]+)"/g)].map((match) => match[1] ?? "");

/** Every tag named in the leftmost column of the README's tag table. */
export const tagsInReadmeTable = (readme: string): string[] =>
    readme
        .split("\n")
        .map((line) => /^\| `((?:type|scope):[^`]+)`/.exec(line)?.[1] ?? "")
        .filter(Boolean);

/** Project directories listed in the README's workspace-layout code block. */
export const projectsInLayoutBlock = (readme: string): string[] => {
    const block = /## 🗂 Workspace layout\s*```([\s\S]*?)```/.exec(readme)?.[1] ?? "";

    return [...block.matchAll(/^\s{4}([\w-]+)\//gm)].map((match) => match[1] ?? "");
};

export const compareTagTables = (boundaries: string, readme: string): Finding[] => {
    const enforced = tagsInBoundaries(boundaries);
    const documented = tagsInReadmeTable(readme);

    const undocumented = enforced.filter((tag) => !documented.includes(tag));
    const unenforced = documented.filter((tag) => !enforced.includes(tag));

    const findings: Finding[] = [];

    if (undocumented.length > 0) {
        findings.push({
            id: "tag-table-undocumented",
            title: "A tag is enforced but not documented",
            detail: `${undocumented.join(", ")} appears in boundaries.ts with no row in the README tag table.`,
            evidence: [BOUNDARIES_PATH, README_PATH],
            blocks: false,
        });
    }

    if (unenforced.length > 0) {
        findings.push({
            id: "tag-table-unenforced",
            title: "A tag is documented but not enforced",
            detail: `${unenforced.join(", ")} has a README row but no depConstraints entry.`,
            evidence: [README_PATH, BOUNDARIES_PATH],
            blocks: false,
        });
    }

    return findings;
};

export const compareLayoutBlock = (readme: string, projectRoots: string[]): Finding[] => {
    const listed = projectsInLayoutBlock(readme);
    const missing = projectRoots
        .map((root) => root.split("/").at(-1) ?? "")
        .filter((directory) => directory && !listed.includes(directory));

    if (missing.length === 0) return [];

    return [
        {
            id: "layout-block-incomplete",
            title: "A project is missing from the workspace layout",
            detail: `${missing.join(", ")} exists in the workspace but is not in the README layout block.`,
            evidence: [README_PATH],
            blocks: false,
        },
    ];
};
