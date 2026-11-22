import { ExpectedError } from "../../shared/errors.ts";

export interface ProjectManifest {
    root: string;
    name: string;
    description: string;
    tags: string[];
}

interface Constraint {
    tag: string;
    allowed: string[];
}

export const README_PATH = "README.md";

export const BOUNDARIES_PATH = "packages/configs/src/eslint/lib/boundaries.ts";

/** Read as text, the way the portal's invariants do: a cross-project import would trip the boundary rule. */
export const constraintsIn = (source: string): Constraint[] =>
    [...source.matchAll(/sourceTag:\s*"([^"]+)",\s*onlyDependOnLibsWithTags:\s*\[([^\]]*)\]/g)].map(
        ([, tag = "", list = ""]) => ({
            tag,
            allowed: [...list.matchAll(/"([^"]+)"/g)].map(([, allowed = ""]) => allowed),
        }),
    );

const code = (value: string): string => `\`${value}\``;

const directory = (root: string): string => root.split("/").at(-1) ?? root;

const tagTable = (
    heading: string,
    constraints: Constraint[],
    projects: ProjectManifest[],
): string[] => [
    `| ${heading} | May depend on | Who has it |`,
    "| --- | --- | --- |",
    ...constraints.map(({ tag, allowed }) => {
        const holders = projects
            .filter((project) => project.tags.includes(tag))
            .map((project) => code(directory(project.root)))
            .sort((a, b) => a.localeCompare(b));

        const depends = allowed.length > 0 ? allowed.map(code).join(", ") : "nothing";
        return `| ${code(tag)} | ${depends} | ${holders.join(", ") || "—"} |`;
    }),
];

const layout = (projects: ProjectManifest[], tops: string[]): string[] => {
    const width = Math.max(...projects.map((project) => directory(project.root).length)) + 2;

    return [
        "```",
        ...tops.flatMap((top) => [
            `${top}/`,
            ...projects
                .filter((project) => project.root.startsWith(`${top}/`))
                .sort((a, b) => a.root.localeCompare(b.root))
                .map(({ root, name, description }) => {
                    const folder = `${directory(root)}/`.padEnd(width);
                    const line = `    ${folder}${name}`;
                    return description ? `${line} — ${description}` : line;
                }),
        ]),
        "```",
    ];
};

interface Region {
    name: string;
    lines: string[];
}

export const readmeRegions = (
    constraints: Constraint[],
    projects: ProjectManifest[],
    tops: string[],
): Region[] => {
    if (constraints.length === 0) {
        throw new ExpectedError(`No depConstraints parsed from ${BOUNDARIES_PATH}.`);
    }

    const ofKind = (prefix: string): Constraint[] =>
        constraints.filter(({ tag }) => tag.startsWith(prefix));

    return [
        { name: "layout", lines: layout(projects, tops) },
        { name: "type-tags", lines: tagTable("Tag", ofKind("type:"), projects) },
        { name: "scope-tags", lines: tagTable("Scope", ofKind("scope:"), projects) },
    ];
};

/** Replace what sits between each region's markers, leaving the prose around them hand-written. */
export const spliceRegions = (readme: string, regions: Region[]): string =>
    regions.reduce((text, { name, lines }) => {
        const open = `<!-- docs:map:${name} -->`;
        const close = `<!-- /docs:map:${name} -->`;
        const start = text.indexOf(open);
        const end = text.indexOf(close);

        if (start === -1 || end < start) {
            throw new ExpectedError(`${README_PATH} is missing the ${open} … ${close} markers.`);
        }

        return [text.slice(0, start + open.length), ...lines, text.slice(end)].join("\n");
    }, readme);
