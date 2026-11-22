import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import WorkflowProjects from "./WorkflowProjects.vue";

const TEMPLATE = {
    id: "site",
    title: "Website",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [{ id: "page", stage: "build", title: "Page" }],
};

describe("WorkflowProjects", () => {
    it("shows a card per project and always offers a new one", async () => {
        const { projects } = assembleWorkflows(
            [{ file: "site.yaml", ok: true, value: TEMPLATE }],
            [
                {
                    file: "blog.yaml",
                    ok: true,
                    value: { id: "blog", title: "Blog", template: "site", milestone: "Blog" },
                },
            ],
            {},
        );

        const wrapper = await mountSuspended(WorkflowProjects, { props: { projects } });

        expect(wrapper.find("a[href='/workflows/blog']").exists()).toBe(true);
        expect(wrapper.find("a[href='/workflows/new']").exists()).toBe(true);
    });

    it("still offers a new project when there is none yet", async () => {
        const wrapper = await mountSuspended(WorkflowProjects, { props: { projects: [] } });

        expect(wrapper.find("a[href='/workflows/new']").exists()).toBe(true);
    });
});
