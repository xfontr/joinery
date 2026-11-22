import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Board from "./Board.vue";

const TEMPLATE = {
    id: "site",
    title: "Website",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [{ id: "page", stage: "build", title: "Page" }],
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

const mount = (days: number) => {
    if (!VIEW) throw new Error("the fixture project did not assemble");
    return mountSuspended(Board, {
        props: {
            stages: VIEW.stages,
            syncedStages: VIEW.stages,
            activeStage: VIEW.stages[0],
            activeIndex: 0,
            selected: VIEW.capabilities[0],
            activity: null,
            days,
            dayLabel: "today",
            day: 0,
        },
    });
};

describe("WorkflowBoard", () => {
    it("scrolls to the picked block's card from the label under the skyline", async () => {
        const scroll = vi.fn();
        vi.spyOn(HTMLElement.prototype, "scrollIntoView").mockImplementation(scroll);
        const wrapper = await mount(0);

        await wrapper
            .find("button:has(.i-lucide-arrow-down), button:has([class*='arrow-down'])")
            .trigger("click");

        expect(scroll).toHaveBeenCalledOnce();
    });

    it("offers the replay only when the snapshot covers a day", async () => {
        expect((await mount(0)).find("[aria-label='Day to replay']").exists()).toBe(false);
        expect((await mount(3)).find("[aria-label='Day to replay']").exists()).toBe(true);
    });
});
