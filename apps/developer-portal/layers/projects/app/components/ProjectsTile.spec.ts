import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { InvariantFinding } from "#layers/snapshot/shared/types/InvariantFinding.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import type { ProjectsArtifact } from "#layers/snapshot/shared/types/ProjectsArtifact.ts";
import ProjectsTile from "./ProjectsTile.vue";

const artifacts = vi.hoisted(() => ({
    metrics: null as MetricsArtifact | null,
    projects: null as ProjectsArtifact | null,
}));
mockNuxtImport("metricsArtifact", () => () => artifacts.metrics);
mockNuxtImport("projectsArtifact", () => () => artifacts.projects);

beforeEach(() => {
    artifacts.metrics = null;
    artifacts.projects = null;
});

const node = (name: string): ProjectNode => ({
    name,
    root: `packages/${name}`,
    tags: [],
    dependsOn: [],
    dependedOnBy: [],
});

const FINDING = {
    id: "f1",
    title: "A boundary",
    detail: "",
    evidence: [],
} satisfies InvariantFinding;

const open = async (findings: InvariantFinding[]) => {
    artifacts.projects = { generatedAt: "", projects: [node("ui"), node("content")], retired: [] };
    artifacts.metrics = {
        generatedAt: "",
        commit: "",
        branch: "",
        projects: [],
        invariantFindings: findings,
        conventionalCommitRate: null,
        commitsSinceLastRelease: null,
    } satisfies MetricsArtifact;
    const wrapper = await mountSuspended(ProjectsTile);
    await flushPromises();
    return wrapper;
};

describe("ProjectsTile", () => {
    it("counts the collected projects and links to the catalog", async () => {
        const wrapper = await open([]);

        expect(wrapper.text()).toContain("2");
        expect(wrapper.find("a").attributes("href")).toBe("/projects");
    });

    it("counts the invariant findings beside the projects", async () => {
        expect((await open([FINDING])).text()).toContain("1 invariant finding");
    });
});
