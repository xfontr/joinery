import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { WORKSPACE_ROOT } from "./paths.ts";
import { git } from "./run.ts";

// Excluding nested openers keeps failed link candidates from rescanning each other's text and href.
const LINK = /\[[^[\]]*\]\((?<href>[^()\s]+)(?:\s+"[^"]*")?\)/g;
const FENCE = /^\s*(`{3,}|~{3,})/;
// Match whole backtick runs so an unmatched delimiter cannot restart at each of its backticks.
const CODE_SPAN = /(?<!`)(`+)(?:[^`\n]|\n(?![^\S\n]*\n))+\1(?!`)/g;

/**
 * Every inline link's href outside code. A docs page that shows link syntax in a sample is
 * describing a link, not making one, and the remark plugin never sees it as one.
 */
export const hrefsIn = (source: string): string[] => {
    const prose: string[] = [];
    let fence: string | null = null;

    for (const line of source.split("\n")) {
        const marker = FENCE.exec(line)?.[1];

        if (fence === null && marker) fence = marker;
        else if (fence !== null && marker?.startsWith(fence) && line.trim() === marker)
            fence = null;
        else if (fence === null) prose.push(line);
    }

    return [...prose.join("\n").replace(CODE_SPAN, " ").matchAll(LINK)].map(
        (match) => match.groups?.href ?? "",
    );
};

/**
 * Anchors and external links are somebody else's problem; only repo-relative paths are resolvable.
 * A `<placeholder>` is an instruction to whoever copies the doc, not a link, so it is never flagged.
 */
const isRepoRelative = (href: string): boolean =>
    !/^(?:[a-z]+:|\/\/|#)/i.test(href) && !href.includes("<");

const exists = async (path: string): Promise<boolean> => {
    try {
        await access(path);

        return true;
    } catch {
        return false;
    }
};

/**
 * Resolves against the filesystem, not the route table: these files are read on GitHub first, where
 * a link to `./layers` or to `./vite.config.ts` is valid.
 */
const isBroken = async (fromFile: string, href: string): Promise<boolean> => {
    const [target] = href.split("#");
    const path = target?.replace(/:\d+(?:-\d+)?$/, "");

    if (!path) return false;

    const absolute = resolve(dirname(resolve(WORKSPACE_ROOT, fromFile)), decodeURIComponent(path));

    return !(await exists(absolute)) && !(await exists(`${absolute}.md`));
};

/** Every relative link, in every tracked or unignored markdown file, whose target isn't on disk. */
export const brokenLinks = async (): Promise<{ file: string; message: string }[]> => {
    const paths = (
        await git(["ls-files", "--cached", "--others", "--exclude-standard", "--", "*.md"])
    )
        .split("\n")
        .filter(Boolean);

    const perFile = await Promise.all(
        paths.map(async (file) => {
            const absolute = resolve(WORKSPACE_ROOT, file);

            if (!(await exists(absolute))) return [];

            const hrefs = hrefsIn(await readFile(absolute, "utf8")).filter(isRepoRelative);
            const broken = await Promise.all(hrefs.map((href) => isBroken(file, href)));

            return hrefs
                .filter((_, index) => broken[index])
                .map((href) => ({ file, message: `links to \`${href}\`, which doesn't exist` }));
        }),
    );

    return perFile.flat();
};
