import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import WorkflowTemplates from "./WorkflowTemplates.vue";

const TEMPLATE = {
    id: "site",
    title: "Website",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [{ id: "page", stage: "build", title: "Page" }],
};

const { templates } = assembleWorkflows([{ file: "site.yaml", ok: true, value: TEMPLATE }], [], {});

describe("WorkflowTemplates", () => {
    it("keeps the templates folded away until asked for", async () => {
        const wrapper = await mountSuspended(WorkflowTemplates, { props: { templates } });

        expect(wrapper.text()).not.toContain("Website");

        await wrapper.find("button").trigger("click");

        expect(wrapper.text()).toContain("Website");
    });
});
