import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { ProjectMap } from "~/types/ProjectMap";
import WorkflowGlyph from "./WorkflowGlyph.vue";

const node = (id: string, x: number) => ({
    id,
    title: id,
    label: id,
    tone: "done" as const,
    owner: false,
    x,
    y: 0,
});

const MAP = {
    stages: [],
    nodes: [node("page", 0), node("launch", 52)],
    edges: [{ id: "page-launch", d: "M10 5 C20 5 42 5 52 5" }],
    width: 62,
    height: 16,
    nodeWidth: 10,
    nodeHeight: 10,
    blocks: { done: 2, moving: 0, total: 2 },
    tickets: null,
} satisfies ProjectMap;

describe("WorkflowGlyph", () => {
    it("draws one square per block and one line per dependency, named for screen readers", async () => {
        const wrapper = await mountSuspended(WorkflowGlyph, {
            props: { map: MAP, label: "Blog's map" },
        });

        expect(wrapper.findAll("rect")).toHaveLength(2);
        expect(wrapper.findAll("[data-edge]")).toHaveLength(1);
        expect(wrapper.find("svg").attributes("aria-label")).toBe("Blog's map");
    });
});
