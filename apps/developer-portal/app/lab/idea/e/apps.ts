export const BASE = "/lab/idea/e/developer";

export type AppId = "home" | "catalog" | "docs" | "work" | "health";

export const apps: { id: AppId; label: string; icon: string; to: string | null }[] = [
    { id: "home", label: "Home", icon: "i-lucide-house", to: BASE },
    { id: "catalog", label: "Catalog", icon: "i-lucide-boxes", to: `${BASE}/catalog` },
    { id: "docs", label: "Docs", icon: "i-lucide-book-open", to: null },
    { id: "work", label: "Work", icon: "i-lucide-kanban", to: null },
    { id: "health", label: "Health", icon: "i-lucide-heart-pulse", to: `${BASE}/health` },
];

export const kindIcons: Record<string, string> = {
    apps: "i-lucide-app-window",
    packages: "i-lucide-package",
    infrastructure: "i-lucide-server",
};

export const healthTabs = [
    { id: "coverage", label: "Coverage" },
    { id: "deps", label: "Dependencies" },
    { id: "tooling", label: "Tooling usage" },
] as const;

export const folderOf = (root: string): string => root.split("/").at(-1) ?? root;

export const projectPath = (root: string): string => `${BASE}/catalog/${folderOf(root)}`;
