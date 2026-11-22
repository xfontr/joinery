import type { DocKind } from "#layers/snapshot/shared/types/DocKind.ts";
import { stripLeadingEmoji, toTitleCase } from "#layers/docs/shared/docPages.ts";
import type { Translate } from "~/types/Translate";

/** Nothing below may compare against a capitalised path — `@nuxt/content` lower-cases every path it finds. */

interface WikiPage {
    path: string;
    title?: string;
}

export interface WikiEntry {
    /** The collection path, e.g. `/packages/ui/readme`. The route prefixes it with `/wiki`. */
    path: string;
    label: string;
    kind: DocKind;
}

export interface WikiGroup {
    key: string;
    label: string;
    entries: WikiEntry[];
}

export interface WikiSection {
    id: string;
    label: string;
    icon: string;
    /** Why this section exists, shown on the wiki home and nowhere else. */
    blurb: string;
    groups: WikiGroup[];
}

/**
 * The decisions and audits *rubrics* aren't excluded — they're docs about the process, not the
 * records. A `TEMPLATE.md`'s placeholder heading (`<Decision title>`) is markup `@nuxt/content`
 * treats as raw HTML and drops from the extracted title, so its nav entry would end up blank.
 */
const EXCLUDED = [
    /\/changelog$/,
    /^\/docs\/decisions\/\d{4}-/,
    /^\/docs\/audits\/\d{4}-/,
    /^\/docs\/benchmarks\/(?!readme$)/,
    /\/template$/,
];

/** Each project area is its own wiki section. */
const PROJECT_AREAS = ["apps", "packages", "infrastructure"] as const;

const SECTION_ORDER = ["workspace", "docs", ...PROJECT_AREAS, "agents"] as const;

type SectionId = (typeof SECTION_ORDER)[number];

const SECTION_ICONS = {
    workspace: "i-lucide-home",
    docs: "i-lucide-library",
    apps: "i-lucide-app-window",
    packages: "i-lucide-package",
    infrastructure: "i-lucide-server",
    agents: "i-lucide-bot",
} as const satisfies Record<SectionId, string>;

/** Ordered where the order carries meaning; anything new falls through to alphabetical. */
const DOCS_GROUPS = ["concepts", "guides", "decisions", "audits", "workflows", "benchmarks"];

/** The folders with a `wiki.groups.<folder>` label; any other folder is title-cased. */
const NAMED_GROUPS = new Set([...DOCS_GROUPS, "skills", "agents"]);

const groupLabel = (group: string, t: Translate, fallback: string): string =>
    NAMED_GROUPS.has(group) ? t(`wiki.groups.${group}`) : fallback;

const segmentsOf = (path: string): string[] => path.split("/").filter(Boolean);

const kindOf = (path: string): DocKind => {
    if (path.endsWith("/skill")) return "skill";
    if (path.endsWith("/agents") || path === "/agents") return "agent";
    if (path.startsWith("/docs/")) return "doc";

    return "readme";
};

interface Placed {
    section: SectionId;
    group: string;
    groupLabel: string;
    entry: WikiEntry;
}

/** A generic label for a README, since its group already names the project. */
const labelWithin = (root: string, path: string, title: string, t: Translate): string => {
    const raw = segmentsOf(path.slice(root.length));
    const rest = raw[0] === "src" ? raw.slice(1) : raw;
    const file = rest.at(-1) ?? "";
    const directory = rest.slice(0, -1).join("/");

    if (file === "skill") return stripLeadingEmoji(title);
    if (file === "readme") return directory === "" ? t("wiki.overview") : directory;

    return stripLeadingEmoji(title);
};

const place = (page: WikiPage, t: Translate): Placed => {
    const { path } = page;
    const title = page.title ?? path;
    const segments = segmentsOf(path);
    const kind = kindOf(path);

    if (segments[0] === ".claude") {
        const group = segments[1] ?? "skills";

        return {
            section: "agents",
            group,
            groupLabel: groupLabel(group, t, group),
            entry: { path, label: stripLeadingEmoji(title), kind },
        };
    }

    if (segments[0] === "docs") {
        const group = segments.length > 2 ? (segments[1] ?? "docs") : "docs";
        const root = group === "docs" ? "/docs" : `/docs/${group}`;

        return {
            section: "docs",
            group,
            groupLabel:
                group === "docs"
                    ? t("wiki.groups.start")
                    : groupLabel(group, t, toTitleCase(group)),
            entry: { path, label: labelWithin(root, path, title, t), kind },
        };
    }

    if (segments.length === 1) {
        return {
            section: "workspace",
            group: "root",
            groupLabel: t("wiki.groups.root"),
            entry: { path, label: stripLeadingEmoji(title), kind },
        };
    }

    const area = segments[0] as SectionId;
    const group = segments[1] ?? area;
    const root = `/${segments.slice(0, 2).join("/")}`;

    return {
        section: area,
        group,
        groupLabel: toTitleCase(group),
        entry: { path, label: labelWithin(root, path, title, t), kind },
    };
};

const rankGroup = (section: SectionId, key: string): number => {
    if (section === "docs") {
        if (key === "docs") return -1;

        const index = DOCS_GROUPS.indexOf(key);

        return index === -1 ? DOCS_GROUPS.length : index;
    }

    return 0;
};

export const buildWiki = (pages: WikiPage[], t: Translate): WikiSection[] => {
    const placed = pages
        .filter((page) => !EXCLUDED.some((pattern) => pattern.test(page.path)))
        .map((page) => place(page, t));

    /** Overview first, then everything else by label. */
    const rankEntry = (entry: WikiEntry): number => (entry.label === t("wiki.overview") ? 0 : 1);

    return SECTION_ORDER.map((id) => {
        const mine = placed.filter((item) => item.section === id);
        const keys = [...new Set(mine.map((item) => item.group))];

        const groups = keys
            .map((key) => ({
                key,
                label: mine.find((item) => item.group === key)?.groupLabel ?? key,
                entries: mine
                    .filter((item) => item.group === key)
                    .map((item) => item.entry)
                    .sort((a, b) => rankEntry(a) - rankEntry(b) || a.label.localeCompare(b.label)),
            }))
            .sort(
                (a, b) => rankGroup(id, a.key) - rankGroup(id, b.key) || a.key.localeCompare(b.key),
            );

        return {
            id,
            label: t(`wiki.sections.${id}.label`),
            icon: SECTION_ICONS[id],
            blurb: t(`wiki.sections.${id}.blurb`),
            groups,
        };
    }).filter((section) => section.groups.length > 0);
};

/** The section and group a path sits in, for the breadcrumb above a page. */
export const locate = (
    sections: WikiSection[],
    path: string,
): { section: WikiSection; group: WikiGroup; entry: WikiEntry } | null => {
    for (const section of sections) {
        for (const group of section.groups) {
            const entry = group.entries.find((candidate) => candidate.path === path);

            if (entry) return { section, group, entry };
        }
    }

    return null;
};
