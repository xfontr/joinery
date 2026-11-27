import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import GraphSection from "./GraphSection.vue";

const MESSAGES = {
    workflowGraph: {
        details: "Details for {title}",
        fit: "Fit the selected path",
        full: "Full screen",
        node: "{title}, {state}",
        relation: {
            waits: "waits on it",
        },
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
    },
    workflowGraphSection: {
        hint: "Click an empty spot for the whole map",
        title: "Dependency graph",
        titleSelected: "Dependency graph · {title}",
    },
    workflows: {
        capabilityState: {
            "can-file": "Can file now",
            waits: "Waits on a decision",
        },
    },
};

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

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowGraphSection", () => {
    it("heads the graph with the block picked", async () => {
        if (!VIEW) throw new Error("the fixture project did not assemble");
        const wrapper = await mountSuspended(GraphSection, {
            props: { view: VIEW, selected: VIEW.capabilities[0] },
        });

        expect(wrapper.find("h2").text()).toContain("Page");
    });
});
