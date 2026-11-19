import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import WorkflowProgressMeter from "./WorkflowProgressMeter.vue";

describe("WorkflowProgressMeter", () => {
    it.each([
        [100, "tone-good"],
        [60, "tone-warn"],
        [10, "text-dimmed"],
    ])("colours %i%% as %s, beside the number rather than instead of it", async (percent, tone) => {
        const wrapper = await mountSuspended(WorkflowProgressMeter, { props: { percent } });

        expect(wrapper.text()).toBe(`${percent}%`);
        expect(wrapper.findComponent({ name: "UProgress" }).classes()).toContain(tone);
    });

    it("never fills the bar past full", async () => {
        const wrapper = await mountSuspended(WorkflowProgressMeter, { props: { percent: 140 } });

        expect(wrapper.findComponent({ name: "UProgress" }).props("modelValue")).toBe(100);
    });
});
