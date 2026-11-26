import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import WorkflowGlyph from "./WorkflowGlyph.vue";

describe("WorkflowGlyph", () => {
    it("keeps the notes out of a bare glyph", async () => {
        const wrapper = await mountSuspended(WorkflowGlyph);

        expect(wrapper.find("svg").attributes("aria-label")).toBe("workflowTeaser.glyphLabel");
        expect(wrapper.find("[data-note]").exists()).toBe(false);
    });

    it("notes two blocks when annotated, hidden from screen readers", async () => {
        const wrapper = await mountSuspended(WorkflowGlyph, { props: { annotated: true } });

        expect(wrapper.findAll("[data-note][aria-hidden]")).toHaveLength(2);
    });
});
