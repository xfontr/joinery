import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import WorkflowTeaser from "./WorkflowTeaser.vue";

describe("WorkflowTeaser", () => {
    it("draws Huella Legal's plan with no portal data, leading to the live maps", async () => {
        const wrapper = await mountSuspended(WorkflowTeaser);

        expect(wrapper.get("a").attributes("href")).toBe("/agentic-workflows");
        expect(wrapper.findAll("[data-workflow-glyph] [data-node]").length).toBeGreaterThan(0);
    });
});
