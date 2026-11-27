import { existsSync } from "node:fs";
import { relative, resolve } from "node:path";
import {
    isPlaceholder,
    REPO_SCHEME,
    resolveDocImage,
    resolveDocLink,
} from "#layers/docs/shared/docLinks.ts";
import { WORKSPACE_ROOT } from "./paths.ts";

interface MarkdownNode {
    type: string;
    url?: string;
    children?: MarkdownNode[];
}

/** `@nuxtjs/mdc` hands the parser the collection's file record, whose `path` is absolute. */
interface SourceFile {
    path?: string;
}

/**
 * Reference definitions and bare autolinks are not used anywhere in these docs, so an inline `link`
 * is every link there is. Takes the parent, because a placeholder is replaced by its own children.
 */
const eachLink = (
    parent: MarkdownNode,
    apply: (link: MarkdownNode) => MarkdownNode[] | null,
): void => {
    const children = parent.children ?? [];

    for (let index = children.length - 1; index >= 0; index -= 1) {
        const child = children[index];

        if (!child) continue;

        eachLink(child, apply);

        if (child.type !== "link") continue;

        const replacement = apply(child);

        if (replacement) children.splice(index, 1, ...replacement);
    }
};

const eachImage = (parent: MarkdownNode, apply: (image: MarkdownNode) => void): void => {
    for (const child of parent.children ?? []) {
        if (child.type === "image") apply(child);
        else eachImage(child, apply);
    }
};

/** The `.md` is appended rather than required, because a link may omit it and `checkLink` accepts that. */
const isPage = (repoPath: string): boolean => {
    // `content.config.ts` leaves every CLAUDE.md out of the collection, so none has a page.
    if (/(?:^|\/)CLAUDE(?:\.md)?$/i.test(repoPath)) return false;

    const absolute = resolve(WORKSPACE_ROOT, repoPath);

    return /\.mdx?$/i.test(repoPath) ? existsSync(absolute) : existsSync(`${absolute}.md`);
};

const isMissing = (url: string): boolean => {
    if (!url.startsWith(REPO_SCHEME)) return false;

    const [path = ""] = url.slice(REPO_SCHEME.length).split("#");

    return !existsSync(resolve(WORKSPACE_ROOT, decodeURIComponent(path)));
};

/**
 * Remark, not rehype: the mdast-to-hast step strips `.md` from a relative href on its way through,
 * and that extension is the only thing distinguishing a page from a directory. Do not move this later.
 */
export default function remarkDocLinks() {
    return (tree: MarkdownNode, file: SourceFile): void => {
        if (!file.path) return;

        const from = relative(WORKSPACE_ROOT, file.path);

        eachLink(tree, (link) => {
            const href = link.url ?? "";

            if (isPlaceholder(href)) return link.children ?? [];

            const url = resolveDocLink(href, from, isPage) ?? href;

            // `@nuxt/content` rewrites a `repo:…/x.md` href to the relative route `…/x`, which the
            // prerender crawler follows into a 404.
            if (isMissing(url)) return link.children ?? [];

            link.url = url;

            return null;
        });

        eachImage(tree, (image) => {
            image.url = resolveDocImage(image.url ?? "", from) ?? image.url;
        });
    };
}
