import type { WidgetDefinition } from "./dashboardLayout.ts";

/** Home's panels: the first four show by default, the rest wait in the Add widget list. */
export const HOME_WIDGETS: readonly WidgetDefinition[] = [
    { id: "queue", label: "Work queue", icon: "i-lucide-list-todo", size: "wide" },
    { id: "health", label: "Health", icon: "i-lucide-activity", size: "medium" },
    { id: "workflows", label: "Workflows", icon: "i-lucide-workflow", size: "medium" },
    { id: "activity", label: "Tooling runs", icon: "i-lucide-chart-column", size: "wide" },
    {
        id: "tooling",
        label: "Tooling usage",
        icon: "i-lucide-wrench",
        size: "medium",
        hidden: true,
    },
    { id: "projects", label: "Projects", icon: "i-lucide-boxes", size: "small", hidden: true },
    { id: "welcome", label: "Welcome", icon: "i-lucide-house", size: "wide", hidden: true },
    {
        id: "featured",
        label: "Featured projects",
        icon: "i-lucide-star",
        size: "wide",
        hidden: true,
    },
];
