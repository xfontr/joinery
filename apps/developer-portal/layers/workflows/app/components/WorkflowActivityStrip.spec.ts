import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { ProjectActivity } from "#layers/workflows/app/utils/workflowActivity.ts";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import WorkflowActivityStrip from "./WorkflowActivityStrip.vue";

const MESSAGES = {
    workflowActivityStrip: {
        moved: "{count} capabilities | {count} capability | {count} capabilities",
        segment: "{stage} · {day} · {moved}",
        tooltip: "Capabilities moved per day, from commits tagged with a ticket number",
    },
};

const TEMPLATE = {
    id: "site",
    title: "Site",
    stages: [
        { id: "build", title: "Build" },
        { id: "launch", title: "Launch" },
    ],
    capabilities: [{ id: "page", stage: "build", title: "Page" }],
};

const STAGES =
    assembleWorkflows(
        [{ file: "site.yaml", ok: true, value: TEMPLATE }],
        [
            {
                file: "blog.yaml",
                ok: true,
                value: { id: "blog", title: "Blog", template: "site", milestone: "Blog" },
            },
        ],
        {},
    ).projects[0]?.stages ?? [];

const ACTIVITY = {
    weeks: ["2026-11-02"],
    peak: 1,
    days: ["2026-11-05", "2026-11-06"],
    byStage: [
        [2, 0],
        [0, 1],
    ],
    busiest: 2,
    capabilities: {},
    lastDay: "2026-11-06",
} satisfies ProjectActivity;

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowActivityStrip", () => {
    it("labels each day's segment with its stage, day and count, and skips a stage with none", async () => {
        const wrapper = await mountSuspended(WorkflowActivityStrip, {
            props: { activity: ACTIVITY, stages: STAGES },
        });

        expect(
            wrapper.findAll("[title*=' · ']").map((segment) => segment.attributes("title")),
        ).toEqual(["Build · 5 Nov · 2 capabilities", "Launch · 6 Nov · 1 capability"]);
    });

    it("dates the last commit, or says there is none", async () => {
        const active = await mountSuspended(WorkflowActivityStrip, {
            props: { activity: ACTIVITY, stages: STAGES },
        });
        expect(active.find("figcaption").text()).toContain("6 Nov");

        const idle = await mountSuspended(WorkflowActivityStrip, {
            props: { activity: { ...ACTIVITY, lastDay: null }, stages: STAGES },
        });
        expect(idle.find("figcaption").text()).not.toContain("Nov");
    });
});
