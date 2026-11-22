import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import GraphSection from "./GraphSection.vue";

const TEMPLATE = {
    id: "site",
    title: "Website",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [
        { id: "page", stage: "build", title: "Page" },
        { id: "launch", stage: "build", title: "Launch", dependsOn: ["page"] },
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

const TITLES = { page: "Page", launch: "Launch" };

describe("WorkflowGraphSection", () => {
    it("heads the graph with the block picked and the longest chain left", async () => {
        if (!VIEW) throw new Error("the fixture project did not assemble");
        const wrapper = await mountSuspended(GraphSection, {
            props: { view: VIEW, selected: VIEW.capabilities[0], titles: TITLES },
        });

        expect(wrapper.find("h2").text()).toContain("Page");
        expect(wrapper.find("header p").text()).toContain("Page → Launch");
    });

    it("passes a block clicked on the graph up as the one to select", async () => {
        if (!VIEW) throw new Error("the fixture project did not assemble");
        const wrapper = await mountSuspended(GraphSection, {
            props: { view: VIEW, titles: TITLES },
        });

        await wrapper.find("button[aria-label^='Launch,']").trigger("click");

        expect(wrapper.emitted("select")).toEqual([["launch"]]);
    });
});
