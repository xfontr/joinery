import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { projectView, readProject, readTemplate } from "#layers/workflows/shared/workflows.ts";
import WorkflowStageCards from "./WorkflowStageCards.vue";

const MESSAGES = {
    workflowStageCards: {
        details: "Details for {title}",
        dot: "#{number} {title} · {status}",
        points: "{points} SP",
        progress: "{done} of {total} · {points}",
        stagePoints: "{done}/{total} SP",
        summary: "{count} {status}",
    },
    workflows: {
        capabilityState: {
            blocked: "Blocked",
            "can-file": "Can file now",
            ready: "Ready",
        },
        ticketStatus: {
            ready: "Ready",
        },
    },
};

const { template } = readTemplate({
    id: "t",
    title: "T",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [
        { id: "kit", stage: "build", title: "Kit" },
        { id: "page", stage: "build", title: "Page", dependsOn: ["kit"] },
        { id: "comments", stage: "build", title: "Comments", optional: true, default: false },
    ],
});
const { project } = readProject({ id: "p", title: "P", template: "t", milestone: "P" });
const ticket = (number: number, caps: string[]) => ({
    number,
    title: `#${number}`,
    url: "",
    state: "open" as const,
    reason: null,
    caps,
    createdAt: null,
    closedAt: null,
    activity: [],
    blockedBy: [],
    branch: false,
    pr: false,
    owner: false,
    complexity: null,
});
const view = projectView(project, template, {
    syncedAt: "2026-11-09T00:00:00Z",
    milestone: "P",
    issues: [ticket(1, ["kit"]), ticket(2, ["page"])],
    noMilestone: [],
});

const mount = (selected: string | null = null) =>
    mountSuspended(WorkflowStageCards, {
        props: { stage: view.stages[0]!, index: 0, selected },
        global: { stubs: { UIcon: true } },
    });

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("WorkflowStageCards", () => {
    it("leaves what a blocked block waits on to its details, keeping the card an overview", async () => {
        const wrapper = await mount();
        const [, page] = wrapper.findAll("li button[aria-pressed]");

        expect(page!.text()).not.toContain("Kit");
    });

    it("shows the SP each block spends, and none on a block nobody estimated", async () => {
        const estimated = projectView(project, template, {
            syncedAt: "2026-11-09T00:00:00Z",
            milestone: "P",
            issues: [{ ...ticket(1, ["kit"]), complexity: 5 }, ticket(2, ["page"])],
            noMilestone: [],
        });
        const wrapper = await mountSuspended(WorkflowStageCards, {
            props: { stage: estimated.stages[0]!, index: 0 },
            global: { stubs: { UIcon: true } },
        });
        const [kit, page] = wrapper.findAll("li button[aria-pressed]");

        expect(kit!.text()).toContain("5 SP");
        expect(page!.text()).not.toContain("SP");
    });

    it.each([
        [6, false, false],
        [5, true, false],
        [6, true, true],
    ])(
        "stacks %i ticket dots in two rows beside an activity line (%s): %s",
        async (count, line, stacked) => {
            const crowded = projectView(project, template, {
                syncedAt: "2026-11-09T00:00:00Z",
                milestone: "P",
                issues: Array.from({ length: count }, (_, index) => ticket(index + 1, ["kit"])),
                noMilestone: [],
            });
            const wrapper = await mountSuspended(WorkflowStageCards, {
                props: {
                    stage: crowded.stages[0]!,
                    index: 0,
                    activity: line
                        ? {
                              kit: {
                                  weeks: [1],
                                  commits: 1,
                                  days: 1,
                                  tickets: 1,
                                  lastDay: "2026-11-02",
                              },
                          }
                        : null,
                },
                global: { stubs: { UIcon: true } },
            });
            expect(wrapper.find(".sr-only").text()).toMatch(new RegExp(`^${count} `));
            const dots = wrapper
                .findAll("[aria-hidden='true']")
                .find((group) => group.findAll("[title]").length === count);
            expect(dots?.classes().includes("grid-rows-2")).toBe(stacked);
        },
    );

    it("gives a switched-off block no card, since it isn't part of the project", async () => {
        const wrapper = await mount();

        expect(wrapper.text()).not.toContain("Comments");
    });

    it("marks the selected block and emits a pick, so the graph can follow", async () => {
        const wrapper = await mount("page");
        const [kit, page] = wrapper.findAll("li button[aria-pressed]");

        expect(page!.attributes("aria-pressed")).toBe("true");
        await kit!.trigger("click");
        expect(wrapper.emitted("select")).toEqual([["kit"]]);
    });

    it("asks for a block's details from its info button without needing it selected first", async () => {
        const wrapper = await mount("page");

        await wrapper.find("button[aria-label='Details for Kit']").trigger("click");
        expect(wrapper.emitted("details")).toEqual([["kit"]]);
    });
});
