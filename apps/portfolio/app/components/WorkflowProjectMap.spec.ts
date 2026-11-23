import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { MapNode } from "~/types/MapNode";
import type { ProjectMap } from "~/types/ProjectMap";
import WorkflowProjectMap from "./WorkflowProjectMap.vue";

const MESSAGES = {
    workflowProjectMap: {
        legend: {
            done: "done",
            moving: "moving now",
            waiting: "waiting on another block",
        },
        owner: "the owner's call",
    },
};

const PAGE = {
    id: "page",
    title: "Page",
    label: "Page",
    tone: "done",
    owner: false,
    x: 0,
    y: 36,
} satisfies MapNode;
const CUTOVER = {
    id: "cutover",
    title: "Cutover",
    label: "Cutover",
    tone: "waiting",
    owner: true,
    x: 184,
    y: 36,
} satisfies MapNode;

const MAP = {
    stages: [
        { id: "build", title: "Build", x: 0, blocks: [PAGE] },
        { id: "launch", title: "Launch", x: 184, blocks: [CUTOVER] },
    ],
    nodes: [PAGE, CUTOVER],
    edges: [{ id: "page-cutover", d: "M164 51 C328 51 20 51 184 51" }],
    width: 348,
    height: 76,
    nodeWidth: 164,
    nodeHeight: 30,
    blocks: { done: 1, moving: 0, total: 2 },
    tickets: null,
} satisfies ProjectMap;

const mount = () => mountSuspended(WorkflowProjectMap, { props: { map: MAP, label: "Blog" } });

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowProjectMap", () => {
    it("lists each block under its stage for a phone, where the drawing is hidden", async () => {
        const stages = (await mount()).findAll("ol.md\\:hidden > li").map((stage) => stage.text());

        expect(stages[0]).toContain("Page");
        expect(stages[1]).toContain("Cutover");
    });

    it("tells a screen reader each block's state, which the glyph alone only shows", async () => {
        const blocks = (await mount()).findAll("li[data-tone]");

        expect(blocks.map((block) => block.find(".sr-only").text())).toEqual([
            ", done",
            ", waiting on another block",
        ]);
    });
});
