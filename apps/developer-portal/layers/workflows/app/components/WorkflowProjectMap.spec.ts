import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { assembleWorkflows, projectMap } from "#layers/workflows/shared/workflows.ts";
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

const TEMPLATE = {
    id: "site",
    title: "Site",
    stages: [
        { id: "build", title: "Build" },
        { id: "launch", title: "Launch" },
    ],
    capabilities: [
        { id: "page", stage: "build", title: "Page" },
        { id: "search", stage: "build", title: "Search", optional: true, default: false },
        { id: "cutover", stage: "launch", title: "Cutover", dependsOn: ["page"] },
    ],
};

const VIEW = assembleWorkflows(
    [{ file: "site.yaml", ok: true, value: TEMPLATE }],
    [
        {
            file: "blog.yaml",
            ok: true,
            value: { id: "blog", title: "Blog", template: "site", milestone: "Blog" },
        },
    ],
    {},
).projects[0];

const mount = () => {
    if (!VIEW) throw new Error("the fixture project did not assemble");
    return mountSuspended(WorkflowProjectMap, { props: { map: projectMap(VIEW), label: "Blog" } });
};

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowProjectMap", () => {
    it("lists the switched-on blocks under their stage, leaving out a feature switched off", async () => {
        const stages = (await mount()).findAll("ol.md\\:hidden > li").map((stage) => stage.text());

        expect(stages[0]).toContain("Page");
        expect(stages[0]).not.toContain("Search");
        expect(stages[1]).toContain("Cutover");
    });

    it("tells a screen reader each block's state, which the glyph alone only shows", async () => {
        const block = (await mount()).find("li[data-tone]");

        expect(block.find(".sr-only").text()).toMatch(
            /^, (done|moving now|waiting on another block)$/,
        );
    });
});
