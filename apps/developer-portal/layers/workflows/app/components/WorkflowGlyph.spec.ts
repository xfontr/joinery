import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { assembleWorkflows, GLYPH_MAP, projectMap } from "#layers/workflows/shared/workflows.ts";
import WorkflowGlyph from "./WorkflowGlyph.vue";

const TEMPLATE = {
    id: "site",
    title: "Site",
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

describe("WorkflowGlyph", () => {
    it("draws one square per block and one line per dependency, named for screen readers", async () => {
        if (!VIEW) throw new Error("the fixture project did not assemble");
        const wrapper = await mountSuspended(WorkflowGlyph, {
            props: { map: projectMap(VIEW, GLYPH_MAP), label: "Blog's map" },
        });

        expect(wrapper.findAll("rect")).toHaveLength(2);
        expect(wrapper.findAll("[data-edge]")).toHaveLength(1);
        expect(wrapper.find("svg").attributes("aria-label")).toBe("Blog's map");
    });
});
