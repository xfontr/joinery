import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import Edges from "./Edges.vue";

const MESSAGES = {
    graphEdges: {
        lead: "What the picture does not answer: which tags a project carries, and what breaks if it changes.",
        leaf: "leaf",
        title: "Tags and edges",
        uses: "uses {list}",
    },
};

const UI = {
    name: "@monorepo/ui",
    root: "packages/ui",
    tags: ["type:package", "scope:shared"],
    dependsOn: ["@monorepo/configs"],
    dependedOnBy: [],
} satisfies ProjectNode;

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("GraphEdges", () => {
    it("lists each project's tags and the projects it uses", async () => {
        const wrapper = await mountSuspended(Edges, { props: { projects: [UI] } });

        expect(wrapper.text()).toContain("type:package");
        expect(wrapper.text()).toContain("@monorepo/configs");
    });

    it("calls a project with no edges a leaf", async () => {
        const wrapper = await mountSuspended(Edges, {
            props: { projects: [{ ...UI, dependsOn: [] }] },
        });

        expect(wrapper.text()).toContain("leaf");
    });
});
