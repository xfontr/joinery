import type { AppEntry } from "~/types/AppEntry";
import type { AppGroup } from "~/types/AppGroup";
import type { NavLink } from "~/types/NavLink";

const APPS: readonly AppGroup[] = [
    { id: "home", label: "Home", icon: "i-lucide-house", items: ["overview"] },
    {
        id: "catalog",
        label: "Catalog",
        icon: "i-lucide-boxes",
        items: ["projects", "graph", "changelog"],
    },
    {
        id: "docs",
        label: "Docs",
        icon: "i-lucide-book-open",
        items: ["docs", "decisions", "audits", "benchmarks"],
    },
    { id: "work", label: "Work", icon: "i-lucide-kanban", items: ["workflows", "issues"] },
    {
        id: "health",
        label: "Health",
        icon: "i-lucide-heart-pulse",
        items: ["coverage", "deps", "telemetry"],
        tabs: true,
    },
];

/** Each app with the entries its layers declare; an app left with none is dropped. */
export const appEntries = (
    nav: Record<string, NavLink | undefined>,
): (AppGroup & { entries: AppEntry[] })[] =>
    APPS.map((app) => ({
        ...app,
        entries: app.items.flatMap((key) => {
            const link = nav[key];
            return link ? [{ key, ...link }] : [];
        }),
    })).filter((app) => app.entries.length > 0);

const owns = (to: string, path: string): boolean => path === to || path.startsWith(`${to}/`);

/** The app and entry a path belongs to, by the longest entry route that contains it. */
export const locate = <T extends { entries: AppEntry[] }>(
    apps: T[],
    path: string,
): { app: T; entry: AppEntry } | null =>
    apps
        .flatMap((app) => app.entries.map((entry) => ({ app, entry })))
        .filter(({ entry }) => owns(entry.to, path))
        .toSorted((a, b) => b.entry.to.length - a.entry.to.length)[0] ?? null;
