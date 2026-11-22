import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import WorkflowTemplateCard from "./WorkflowTemplateCard.vue";

const TEMPLATE = {
    id: "site",
    title: "Website",
    stages: [
        { id: "build", title: "Build" },
        { id: "launch", title: "Launch" },
    ],
    capabilities: [
        { id: "page", stage: "build", title: "Page", complexity: 3 },
        { id: "search", stage: "build", title: "Search", optional: true, default: false },
        { id: "cutover", stage: "launch", title: "Cutover", complexity: 2 },
    ],
};

const [SITE] = assembleWorkflows(
    [{ file: "site.yaml", ok: true, value: TEMPLATE }],
    [],
    {},
).templates;

const mount = () => {
    if (!SITE) throw new Error("the fixture template did not assemble");
    return mountSuspended(WorkflowTemplateCard, { props: { template: SITE } });
};

describe("WorkflowTemplateCard", () => {
    it("lists each stage's blocks under it, in order", async () => {
        const stages = (await mount()).findAll("ol > li").map((stage) => stage.text());

        expect(stages[0]).toMatch(/^1\. Build.*Page.*Search/);
        expect(stages[1]).toMatch(/^2\. Launch.*Cutover/);
    });

    it("prices the default blocks, leaving out an optional one that starts off", async () => {
        expect((await mount()).text()).toMatch(/2 blocks by default · 5 SP/);
    });
});
