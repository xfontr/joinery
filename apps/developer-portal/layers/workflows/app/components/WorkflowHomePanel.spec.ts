import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import {
    assembleWorkflows,
    type ParsedFile,
    type Workflows,
} from "#layers/workflows/shared/workflows.ts";
import WorkflowHomePanel from "./WorkflowHomePanel.vue";

const TEMPLATE = {
    id: "site",
    title: "Website",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [{ id: "page", stage: "build", title: "Page" }],
};

const project = (id: string, settled: Record<string, object> = {}): ParsedFile => ({
    file: `${id}.yaml`,
    ok: true,
    value: { id, title: id, template: "site", milestone: id, settled },
});

const open = async (data: Workflows) => {
    serveEndpoint("/api/workflows", () => data);
    const wrapper = await mountSuspended(WorkflowHomePanel);
    await flushPromises();
    return wrapper;
};

describe("WorkflowHomePanel", () => {
    it("lists only the projects with blocks still to finish, each linked to its map", async () => {
        const wrapper = await open(
            assembleWorkflows(
                [{ file: "site.yaml", ok: true, value: TEMPLATE }],
                [project("blog"), project("shop", { page: { status: "done", note: "" } })],
                {},
            ),
        );

        expect(wrapper.findAll("li a").map((link) => link.attributes("href"))).toEqual([
            "/workflows/blog",
        ]);
    });

    it("lists nothing when no workflow is running", async () => {
        const wrapper = await open(assembleWorkflows([], [], {}));

        expect(wrapper.find("ul").exists()).toBe(false);
    });
});
