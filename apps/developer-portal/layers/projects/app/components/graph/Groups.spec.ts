import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import Groups from "./Groups.vue";

const node = (root: string, links: Partial<ProjectNode> = {}): ProjectNode => ({
    name: root,
    root,
    tags: [],
    dependsOn: [],
    dependedOnBy: [],
    ...links,
});

const groups = (wrapper: VueWrapper) => {
    const cards = wrapper.findAll(".grid > *");
    return Object.fromEntries(
        cards.map((card) => [
            card.find("h3").text(),
            card.findAll("p.font-mono").map((root) => root.text()),
        ]),
    );
};

describe("GraphGroups", () => {
    it("files each project under apps, packages or tooling by where it lives", async () => {
        const wrapper = await mountSuspended(Groups, {
            props: {
                projects: [node("apps/blog"), node("packages/ui"), node("infrastructure/scripts")],
            },
        });

        expect(groups(wrapper)).toEqual({
            Applications: ["apps/blog"],
            "Shared building blocks": ["packages/ui"],
            "Repository tooling": ["infrastructure/scripts"],
        });
    });

    it("lists what a project uses and what uses it", async () => {
        const wrapper = await mountSuspended(Groups, {
            props: {
                projects: [node("packages/ui", { dependsOn: ["a", "b"], dependedOnBy: ["c"] })],
            },
        });

        expect(wrapper.text()).toContain("a, b");
        expect(wrapper.text()).toContain("c");
    });
});
