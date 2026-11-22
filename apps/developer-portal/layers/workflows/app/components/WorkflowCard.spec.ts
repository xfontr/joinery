import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import WorkflowCard from "./WorkflowCard.vue";

const TEMPLATE = {
    id: "site",
    title: "Website",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [
        { id: "page", stage: "build", title: "Page" },
        { id: "nav", stage: "build", title: "Nav" },
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

describe("WorkflowCard", () => {
    it("links to the project and counts what is done out of its blocks", async () => {
        if (!VIEW) throw new Error("the fixture project did not assemble");
        const wrapper = await mountSuspended(WorkflowCard, { props: { project: VIEW } });

        expect(wrapper.find("a").attributes("href")).toBe("/workflows/blog");
        expect(wrapper.text()).toContain("Website");
        expect(wrapper.text()).toContain("0 of 2 done");
    });
});
