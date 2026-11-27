import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectActivity } from "#layers/workflows/app/utils/workflowActivity.ts";
import {
    assembleWorkflows,
    projectView,
    readProject,
    readTemplate,
} from "#layers/workflows/shared/workflows.ts";
import Board from "./Board.vue";

const MESSAGES = {
    workflowReplay: {
        label: "Day to replay",
        title: "Replay",
        today: "Today",
    },
    workflowSkyline: {
        label: "{title}, {state}",
        title: "{title} · {state}",
    },
    workflowStageCards: {
        progress: "{done} of {total} · {points}",
        stagePoints: "{done}/{total} SP",
    },
    workflows: {
        capabilityState: {
            "can-file": "Can file now",
        },
    },
};

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

const TICKETED = projectView(
    readProject({ id: "blog", title: "Blog", template: "site", milestone: "Blog" }).project,
    readTemplate(TEMPLATE).template,
    {
        syncedAt: "2026-11-09T00:00:00Z",
        milestone: "Blog",
        issues: [
            {
                number: 1,
                title: "#1",
                url: "",
                state: "open",
                reason: null,
                caps: ["page"],
                createdAt: null,
                closedAt: null,
                activity: [],
                blockedBy: [],
                branch: false,
                pr: false,
                owner: false,
                complexity: null,
            },
        ],
        noMilestone: [],
    },
);

const MOVED: ProjectActivity = {
    weeks: ["2026-11-02"],
    peak: 1,
    days: ["2026-11-02"],
    byStage: [[1]],
    busiest: 1,
    capabilities: {
        page: { weeks: [1], commits: 1, days: 1, tickets: 1, lastDay: "2026-11-02" },
    },
    lastDay: "2026-11-02",
};

const ACTIVITY = "button:has(.i-lucide-chart-column), button:has([class*='chart-column'])";

const mount = (days: number, route?: string) => {
    if (!VIEW) throw new Error("the fixture project did not assemble");
    return mountSuspended(Board, {
        route,
        props: {
            stages: VIEW.stages,
            capabilities: VIEW.capabilities,
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

beforeEach(() => {
    localStorage.clear();
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowBoard", () => {
    it.each([
        ["/workflows/blog", "WorkflowStageCards"],
        ["/workflows/blog?view=list", "WorkflowList"],
        ["/workflows/blog?view=map", "WorkflowGraph"],
        ["/workflows/blog?view=nonsense", "WorkflowStageCards"],
    ])(
        "opens %s on the view it names, so a pasted link shows what was copied",
        async (route, view) => {
            const wrapper = await mount(0, route);

            expect(wrapper.findComponent({ name: view }).exists()).toBe(true);
        },
    );

    it("scrolls the list to a stage clicked in the skyline", async () => {
        const scrolled: string[] = [];
        vi.spyOn(HTMLElement.prototype, "scrollIntoView").mockImplementation(function (
            this: HTMLElement,
        ) {
            scrolled.push(this.dataset.stage ?? "");
        });
        const wrapper = await mount(0, "/workflows/blog?view=list");

        await wrapper
            .findAll("ol button")
            .find((button) => button.text().includes("Build"))!
            .trigger("click");

        expect(scrolled).toContain("build");
    });

    it("offers the replay only when the snapshot covers a day", async () => {
        expect((await mount(0)).find(ACTIVITY).exists()).toBe(false);

        const wrapper = await mount(3);
        await wrapper.find(ACTIVITY).trigger("click");

        expect(wrapper.find("[aria-label='Day to replay']").exists()).toBe(true);
    });

    it("draws each block's activity line only while the activity is shown", async () => {
        const wrapper = await mountSuspended(Board, {
            props: {
                stages: TICKETED.stages,
                capabilities: TICKETED.capabilities,
                syncedStages: TICKETED.stages,
                activeStage: TICKETED.stages[0],
                activeIndex: 0,
                activity: MOVED,
                days: 1,
                dayLabel: "today",
                day: 0,
            },
        });
        const lines = () => wrapper.findAllComponents({ name: "WorkflowActivitySpark" });

        expect(lines()).toHaveLength(0);
        await wrapper.find(ACTIVITY).trigger("click");
        expect(lines()).toHaveLength(1);
    });

    it("returns to today when the activity is hidden, so no past day stays on unseen", async () => {
        const wrapper = await mount(3);

        await wrapper.find(ACTIVITY).trigger("click");
        await wrapper.find(ACTIVITY).trigger("click");

        expect(wrapper.emitted("update:day")?.at(-1)).toEqual([2]);
    });
});
