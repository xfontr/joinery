import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import GraphMap from "./Map.vue";

const MESSAGES = {
    graphMap: {
        empty: "Nothing yet",
        lead: "Lead",
        title: "Map",
    },
};

const SITE = {
    name: "@monorepo/site",
    root: "apps/site",
    tags: ["type:app", "scope:site"],
    dependsOn: ["@monorepo/ui"],
    dependedOnBy: [],
} satisfies ProjectNode;

const UI = {
    name: "@monorepo/ui",
    root: "packages/ui",
    tags: ["type:package", "scope:shared"],
    dependsOn: [],
    dependedOnBy: ["@monorepo/site"],
} satisfies ProjectNode;

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("GraphMap", () => {
    it("links each project to its page by folder, labelled without the scope", async () => {
        const wrapper = await mountSuspended(GraphMap, { props: { projects: [SITE, UI] } });
        const link = wrapper.find("a[href='/projects/site']");

        expect(link.text()).toContain("site");
        expect(link.text()).not.toContain("@monorepo");
        expect(link.text()).toContain("type:app");
    });

    it("draws an arrow for each dependency", async () => {
        const wrapper = await mountSuspended(GraphMap, { props: { projects: [SITE, UI] } });

        expect(wrapper.findAll("svg path[marker-end]")).toHaveLength(1);
    });

    it("says nothing was collected rather than drawing an empty frame", async () => {
        const wrapper = await mountSuspended(GraphMap, { props: { projects: [] } });

        expect(wrapper.text()).toContain("Nothing yet");
        expect(wrapper.find("svg").exists()).toBe(false);
    });
});
