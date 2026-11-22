import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import WorkflowTeaser from "./WorkflowTeaser.vue";

const TEMPLATE = {
    id: "website-rebuild",
    title: "Website rebuild",
    stages: [
        { id: "discovery", title: "Discovery" },
        { id: "build", title: "Build" },
    ],
    capabilities: [
        { id: "audit", stage: "discovery", title: "Content audit" },
        { id: "page", stage: "build", title: "Article page", dependsOn: ["audit"] },
    ],
};

const open = async (projects: { id: string; title: string }[]) => {
    serveEndpoint("/api/workflows", () =>
        assembleWorkflows(
            [{ file: "website-rebuild.yaml", ok: true, value: TEMPLATE }],
            projects.map((project) => ({
                file: `${project.id}.yaml`,
                ok: true,
                value: { ...project, template: "website-rebuild", milestone: project.title },
            })),
            {},
        ),
    );
    const wrapper = await mountSuspended(WorkflowTeaser);
    await flushPromises();
    return wrapper;
};

describe("WorkflowTeaser", () => {
    it("draws Huella Legal's plan as the glyph that leads to how projects are run", async () => {
        const wrapper = await open([{ id: "huella-legal", title: "Huella Legal" }]);

        expect(wrapper.get("a").attributes("href")).toBe("/agentic-workflows");
        expect(wrapper.findAll("[data-workflow-glyph] rect")).toHaveLength(2);
    });

    it("draws no glyph while that plan is missing, rather than another project's", async () => {
        const wrapper = await open([{ id: "blog", title: "Blog" }]);

        expect(wrapper.find("[data-workflow-glyph]").exists()).toBe(false);
    });
});
