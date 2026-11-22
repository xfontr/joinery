import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import Edges from "./Edges.vue";

const UI = {
    name: "@monorepo/ui",
    root: "packages/ui",
    tags: ["type:package", "scope:shared"],
    dependsOn: ["@monorepo/configs"],
    dependedOnBy: [],
} satisfies ProjectNode;

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
