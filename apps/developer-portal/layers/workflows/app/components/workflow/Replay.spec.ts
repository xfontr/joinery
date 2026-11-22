import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import Replay from "./Replay.vue";

describe("WorkflowReplay", () => {
    it("can't jump to today while already on it", async () => {
        const wrapper = await mountSuspended(Replay, {
            props: { days: 5, day: 4, label: "today" },
        });

        expect(wrapper.find("button").attributes("disabled")).toBeDefined();
    });

    it("jumps from an earlier day back to the last one", async () => {
        const wrapper = await mountSuspended(Replay, {
            props: { days: 5, day: 1, label: "2 Nov" },
        });

        await wrapper.find("button").trigger("click");

        expect(wrapper.emitted("update:day")).toEqual([[4]]);
    });
});
