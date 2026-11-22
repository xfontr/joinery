import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import type { SnapshotResponse } from "#layers/snapshot/shared/types/SnapshotResponse.ts";
import ProjectsFeatured from "./ProjectsFeatured.vue";

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
    serveEndpoint("/api/snapshot/projects", (): SnapshotResponse => ({
        manifest: null,
        projects: { generatedAt: "", projects, retired: [] },
    }));
    serveEndpoint("/api/snapshot/metrics", (): SnapshotResponse => ({
        manifest: null,
        metrics: null,
    }));
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
