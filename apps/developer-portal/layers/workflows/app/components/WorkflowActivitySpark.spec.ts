import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import WorkflowActivitySpark from "./WorkflowActivitySpark.vue";

describe("WorkflowActivitySpark", () => {
    it("draws every card to the shared peak, so a quiet block reads as quiet", async () => {
        const wrapper = await mountSuspended(WorkflowActivitySpark, {
            props: { weeks: [0, 1, 2], peak: 4, label: "Comments" },
        });

        expect(wrapper.find("circle").attributes("cy")).toBe("12");
    });

    it("ends the line on the latest week, at the right edge", async () => {
        const wrapper = await mountSuspended(WorkflowActivitySpark, {
            props: { weeks: [4, 0], peak: 4, label: "Comments" },
        });

        expect(wrapper.find("circle").attributes()).toMatchObject({ cx: "112", cy: "24" });
        expect(wrapper.find("svg").attributes("aria-label")).toBe("Comments");
    });
});
