import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import ProjectsWelcome from "./ProjectsWelcome.vue";

// The root README the docs collection answers with, or null for a workspace without one
const docs = vi.hoisted(() => ({ readme: null as { title: string; description: string } | null }));

mockNuxtImport("queryCollection", () => () => {
    const query = {
        path: () => query,
        select: () => query,
        first: () => Promise.resolve(docs.readme),
    };
    return query;
});

describe("ProjectsWelcome", () => {
    it("heads the page with the root README's title and description", async () => {
        docs.readme = { title: "Acme monorepo", description: "Placeholder summary" };

        const wrapper = await mountSuspended(ProjectsWelcome);

        expect(wrapper.find("h1").text()).toBe("Acme monorepo");
        expect(wrapper.text()).toContain("Placeholder summary");
    });

    it("links the three ways in to their pages", async () => {
        docs.readme = null;

        const links = (await mountSuspended(ProjectsWelcome))
            .findAll("a")
            .map((link) => link.attributes("href"));

        expect(links).toEqual(["/projects", "/graph", "/wiki/docs/guides/first-hour"]);
    });
});
