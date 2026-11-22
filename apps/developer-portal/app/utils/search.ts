import type { CommandPaletteGroup, CommandPaletteItem } from "@nuxt/ui";
import type { AppEntry } from "~/types/AppEntry";
import type { AppGroup } from "~/types/AppGroup";

/** One heading of one doc, as `queryCollectionSearchSections` splits it. */
export interface SearchSection {
    /** The doc's collection path, plus `#<anchor>` for a heading inside it. */
    id: string;
    title: string;
    /** The headings above this one, the doc's title first. */
    titles: string[];
    level: number;
    content: string;
}

/** Docs that a feature page renders, keyed by that page's `nav` key, so a removed layer falls back to the wiki. */
const RECORDS: Record<string, RegExp> = {
    decisions: /^\/docs\/decisions\/(\d{4}-[^/]+)$/,
    audits: /^\/docs\/audits\/(\d{4}-[^/]+)$/,
    benchmarks: /^\/docs\/benchmarks\/((?!readme$|template$)[^/]+)$/,
};

/** A page whose name or app holds every word typed, in any case; an empty search keeps them all. */
export const matchPages = (term: string, items: CommandPaletteItem[]): CommandPaletteItem[] => {
    const words = term.toLowerCase().split(/\s+/).filter(Boolean);

    return items.filter((item) => {
        const text = `${item.label ?? ""} ${item.suffix ?? ""}`.toLowerCase();
        return words.every((word) => text.includes(word));
    });
};

const WIKI = { id: "docs", label: "Wiki", icon: "i-lucide-file-text", to: "/wiki" };

/** Every page in the rail, then each doc under the page that renders it, the wiki taking the rest. */
export const searchGroups = (
    apps: (AppGroup & { entries: AppEntry[] })[],
    sections: SearchSection[],
): CommandPaletteGroup<CommandPaletteItem>[] => {
    const owners = apps
        .flatMap((app) => app.entries)
        .flatMap((entry) => {
            const pattern = RECORDS[entry.key];
            return pattern
                ? [{ id: entry.key, label: entry.label, icon: entry.icon, to: entry.to, pattern }]
                : [];
        });

    const docs = new Map<string, CommandPaletteItem[]>();

    for (const section of sections) {
        const [path = "", anchor] = section.id.split("#");

        // The doc's own h1 repeats the row the doc already has, under the same title.
        if (anchor !== undefined && section.level === 1) continue;

        const owner = owners
            .map((candidate) => ({ ...candidate, record: candidate.pattern.exec(path)?.[1] }))
            .find(({ record }) => record !== undefined);
        const id = owner?.id ?? WIKI.id;
        const to = owner ? `${owner.to}/${owner.record}` : `${WIKI.to}${path}`;

        docs.set(id, [
            ...(docs.get(id) ?? []),
            {
                label: section.title,
                prefix: section.titles.length > 0 ? `${section.titles.join(" › ")} ›` : undefined,
                suffix: section.content,
                to: anchor === undefined ? to : `${to}#${anchor}`,
                icon: owner?.icon ?? WIKI.icon,
            },
        ]);
    }

    return [
        {
            id: "pages",
            label: "Pages",
            // The palette keeps its 12 best matches across every group, and docs that also match in
            // their text outrank a page matching by name alone, so pages are matched apart.
            ignoreFilter: true,
            postFilter: matchPages,
            items: apps.flatMap((app) =>
                app.entries.map((entry) => ({
                    label: entry.label,
                    suffix: app.label,
                    to: entry.to,
                    icon: entry.icon,
                })),
            ),
        },
        ...[...owners, WIKI].map(({ id, label }) => ({ id, label, items: docs.get(id) ?? [] })),
    ];
};
