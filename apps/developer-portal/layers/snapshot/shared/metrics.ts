import type { ProjectMetrics } from "./types/ProjectMetrics.ts";

/** Spec files across every project; `null` when nothing was collected. */
export const specTotal = (projects: readonly ProjectMetrics[] | undefined): number | null =>
    projects?.length ? projects.reduce((sum, project) => sum + project.specs, 0) : null;

/** Projects with commits since their last release, the furthest behind first. */
export const unreleased = (projects: readonly ProjectMetrics[] | undefined): ProjectMetrics[] =>
    (projects ?? [])
        .filter((project) => (project.unreleasedCommits ?? 0) > 0)
        .sort((a, b) => (b.unreleasedCommits ?? 0) - (a.unreleasedCommits ?? 0));
