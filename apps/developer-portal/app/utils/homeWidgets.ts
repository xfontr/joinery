import type { WidgetDefinition } from "./dashboardLayout.ts";

/** Home's panels: the first four show by default, the rest wait in the Add widget list. */
export const HOME_WIDGETS: readonly Omit<WidgetDefinition, "label">[] = [
    { id: "queue", icon: "i-lucide-list-todo", size: "wide" },
    { id: "health", icon: "i-lucide-activity", size: "medium" },
    { id: "workflows", icon: "i-lucide-workflow", size: "medium" },
    { id: "activity", icon: "i-lucide-chart-column", size: "wide" },
    { id: "tooling", icon: "i-lucide-wrench", size: "medium", hidden: true },
    { id: "projects", icon: "i-lucide-boxes", size: "small", hidden: true },
    { id: "welcome", icon: "i-lucide-house", size: "wide", hidden: true },
    { id: "featured", icon: "i-lucide-star", size: "wide", hidden: true },
];
