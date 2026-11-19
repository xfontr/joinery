import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import WorkflowProgressRing from "./WorkflowProgressRing.vue";

describe("WorkflowProgressRing", () => {
    it.each([
        [100, "tone-good"],
        [60, "tone-warn"],
        [10, "text-dimmed"],
    ])("colours %i%% as %s, beside the number rather than instead of it", (percent, tone) => {
        const wrapper = mount(WorkflowProgressRing, { props: { percent } });

        expect(wrapper.text()).toBe(`${percent}%`);
        expect(wrapper.findAll("circle")[1]?.classes()).toContain(tone);
    });

    it("never overdraws the ring past a full circle", () => {
        const wrapper = mount(WorkflowProgressRing, { props: { percent: 140 } });

        expect(Number(wrapper.findAll("circle")[1]?.attributes("stroke-dashoffset"))).toBe(0);
    });
});
