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

// An in-memory docs collection holding the READMEs the catalog reads
const docs = vi.hoisted(() => ({
    readmes: [] as { path: string; title: string; description: string }[],
}));

mockNuxtImport("queryCollection", () => () => {
    const query = { select: () => query, all: () => Promise.resolve(docs.readmes) };
    return query;
});

const node = (root: string): ProjectNode => ({
    name: `@monorepo/${root.split("/").at(-1) ?? root}`,
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
            "@monorepo/blog",
            "@monorepo/shop",
        ]);
    });

    it("titles an app by its README and links to it in the wiki", async () => {
        docs.readmes = [
            { path: "/apps/blog/readme", title: "The blog", description: "Placeholder line" },
        ];

        const wrapper = await open([node("apps/blog")]);

        expect(wrapper.find("h3").text()).toBe("The blog");
        expect(wrapper.text()).toContain("Placeholder line");
        expect(wrapper.find("a[href='/wiki/apps/blog/readme']").exists()).toBe(true);
    });
});
