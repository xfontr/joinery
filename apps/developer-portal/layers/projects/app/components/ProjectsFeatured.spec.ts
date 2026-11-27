import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { ProjectsArtifact } from "#layers/snapshot/shared/types/ProjectsArtifact.ts";
import ProjectsFeatured from "./ProjectsFeatured.vue";

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

const docs = vi.hoisted(() => ({
    readmes: [] as { path: string; title: string; description: string }[],
}));

mockNuxtImport("queryCollection", () => () => {
    const query = { select: () => query, all: () => Promise.resolve(docs.readmes) };
    return query;
});

const node = (root: string): ProjectNode => ({
    name: `@joinery/${root.split("/").at(-1) ?? root}`,
    root,
    tags: [],
    dependsOn: [],
    dependedOnBy: [],
});

const open = async (projects: ProjectNode[]) => {
    artifacts.projects = { generatedAt: "", projects, retired: [] };
    artifacts.metrics = null;
    const wrapper = await mountSuspended(ProjectsFeatured);
    await flushPromises();
    return wrapper;
};

describe("ProjectsFeatured", () => {
    it("features at most two apps and never a package", async () => {
        const wrapper = await open([
            node("packages/ui"),
            node("apps/blog"),
            node("apps/shop"),
            node("apps/docs"),
        ]);

        expect(wrapper.findAll("h3").map((title) => title.text())).toEqual([
            "@joinery/blog",
            "@joinery/shop",
        ]);
    });
});
