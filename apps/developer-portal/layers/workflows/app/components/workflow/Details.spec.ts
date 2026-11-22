import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Details from "./Details.vue";

const TEMPLATE = {
    id: "site",
    title: "Website",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [{ id: "page", stage: "build", title: "Page" }],
};

const PAGE = assembleWorkflows(
    [{ file: "site.yaml", ok: true, value: TEMPLATE }],
    [
        {
            file: "blog.yaml",
            ok: true,
            value: { id: "blog", title: "Blog", template: "site", milestone: "Blog" },
        },
    ],
    {},
).projects[0]?.capabilities[0];

describe("WorkflowDetails", () => {
    it("titles the slideover with the block and its stage", async () => {
        await mountSuspended(Details, {
            props: {
                open: true,
                capability: PAGE,
                stage: "Build",
                project: "blog",
                titles: {},
                canSettle: false,
            },
        });
        await flushPromises();

        const dialog = document.body.querySelector("[role=dialog]");
        expect(dialog?.textContent).toContain("Page");
        expect(dialog?.textContent).toContain("Build");
    });
});
