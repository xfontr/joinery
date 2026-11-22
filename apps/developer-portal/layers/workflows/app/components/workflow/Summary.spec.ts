import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Summary from "./Summary.vue";

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
            value: {
                id: "blog",
                title: "Blog",
                template: "site",
                milestone: "2026 Q1",
                area: "app:blog",
            },
        },
    ],
    {},
).projects[0];

const mount = () => {
    if (!VIEW) throw new Error("the fixture project did not assemble");
    return mountSuspended(Summary, { props: { view: VIEW, selected: null, blank: false } });
};

describe("WorkflowSummary", () => {
    it("counts the blocks done, filed and still to file", async () => {
        const text = (await mount()).text();

        expect(text).toContain("0 of 2 done");
        expect(text).toContain("2 blocks · 0 tickets filed · 2 to file");
    });

    it("names the milestone and the area label the tickets carry", async () => {
        const text = (await mount()).text();

        expect(text).toContain("2026 Q1");
        expect(text).toContain("app:blog");
    });
});
