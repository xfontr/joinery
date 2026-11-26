import type { DecisionStatus } from "./DecisionStatus.ts";
import type { ProjectMap } from "./ProjectMap.ts";

/** What the developer portal prerenders at `/embed/data.json`; its spec pins these keys. */
export interface SiteData {
    /** `screenshot` is a path on the portal. */
    benchmarks: { id: string; title: string; screenshot: string }[];
    decisions: { id: string; number: string; title: string; status: DecisionStatus | null }[];
    workflows: {
        projects: { id: string; title: string; map: ProjectMap }[];
        templates: { id: string; title: string; summary: string }[];
        lessons: number;
    };
    rules: { enabled: number; inHouse: number } | null;
    specs: number | null;
}
