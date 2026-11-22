import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SnapshotIssue } from "#layers/workflows/shared/types/SnapshotIssue.ts";
import { assembleWorkflows, type Workflows } from "#layers/workflows/shared/workflows.ts";
import Page from "./index.vue";

const editing = vi.hoisted(() => ({ editable: false, edit: vi.fn() }));
mockNuxtImport("useWorkflowEdit", () => () => editing);

const TEMPLATE = {
    id: "website-rebuild",
    title: "Website rebuild",
    stages: [
        { id: "build", title: "Build" },
        { id: "launch", title: "Launch" },
    ],
    capabilities: [
        { id: "comments", stage: "build", title: "Comments", optional: true },
        {
            id: "cutover",
            stage: "launch",
            title: "Cutover",
            optional: false,
            dependsOn: ["comments"],
        },
    ],
};

const PROJECT = {
    id: "blog",
    title: "Blog",
    template: "website-rebuild",
    milestone: "Blog",
    switches: { comments: true },
};

const ticket = (
    number: number,
    title: string,
    overrides: Partial<SnapshotIssue> = {},
): SnapshotIssue => ({
    number,
    title,
    url: "",
    state: "open",
    reason: null,
    caps: [],
    createdAt: null,
    closedAt: null,
    activity: [],
    blockedBy: [],
    branch: false,
    pr: false,
    owner: false,
    complexity: null,
    ...overrides,
});

const ISSUES = [
    ticket(12, "Stray ticket"),
    ticket(13, "Moderate comments", { caps: ["comments"] }),
];

const workflows = (project: object, issues: SnapshotIssue[] = ISSUES): Workflows =>
    assembleWorkflows(
        [{ file: "website-rebuild.yaml", ok: true, value: TEMPLATE }],
        [{ file: "blog.yaml", ok: true, value: project }],
        {
            blog: {
                file: "blog.snapshot.json",
                ok: true,
                value: {
                    syncedAt: "2026-11-09T00:00:00Z",
                    milestone: "Blog",
                    issues,
                    noMilestone: [],
                },
            },
        },
    );

const open = async (data: Workflows = workflows(PROJECT), route = "/workflows/blog") => {
    serveEndpoint("/api/workflows", () => data);
    const wrapper = await mountSuspended(Page, { route });
    await flushPromises();
    return wrapper;
};

/** Opens the popover listing a state's blocks and returns the list, which renders in a portal. */
const blocksIn = async (wrapper: VueWrapper, state: string) => {
    await wrapper
        .findAllComponents({ name: "UPopover" })
        .find((popover) => popover.text().includes(state))!
        .setValue(true, "open");
    await flushPromises();
    return document.body.querySelector<HTMLElement>(`ul[aria-label='${state} blocks']`)!;
};

const graphBlock = (wrapper: VueWrapper, title: string) =>
    wrapper.findComponent({ name: "WorkflowGraph" }).find(`button[aria-label^='${title},']`);

beforeEach(() => {
    editing.editable = false;
    editing.edit.mockReset();
});

describe("workflow page", () => {
    it("puts a ticket with no capability label under To organise", async () => {
        const wrapper = await open();

        expect(wrapper.text()).toContain("1 to organise");
        expect(wrapper.text()).toContain("Stray ticket");
    });

    it("asks for a map on a project with no blocks, instead of calling it done", async () => {
        const wrapper = await open(
            assembleWorkflows(
                [
                    {
                        file: "custom.yaml",
                        ok: true,
                        value: {
                            id: "custom",
                            title: "Custom",
                            stages: [{ id: "build", title: "Build" }],
                        },
                    },
                ],
                [
                    {
                        file: "blog.yaml",
                        ok: true,
                        value: { ...PROJECT, template: "custom", switches: {} },
                    },
                ],
                {},
            ),
        );

        expect(wrapper.text()).toContain("This project has no blocks yet");
        expect(wrapper.text()).not.toContain("Everything switched on is done");
    });

    it("lists every unfinished block under its state, not just the first few", async () => {
        const wrapper = await open();

        expect((await blocksIn(wrapper, "ready")).textContent).toContain("Comments");
        expect((await blocksIn(wrapper, "can file now")).textContent).toContain("Cutover");
    });

    it("lights a block picked from its state's list on its stage cards and on the graph", async () => {
        const wrapper = await open();

        const list = await blocksIn(wrapper, "can file now");
        [...list.querySelectorAll("button")]
            .find((button) => button.textContent?.trim().startsWith("Cutover"))!
            .click();
        await flushPromises();

        expect(wrapper.find("#stage-launch button[aria-pressed='true']").text()).toContain(
            "Cutover",
        );
        expect(graphBlock(wrapper, "Cutover").attributes("aria-pressed")).toBe("true");
        expect(graphBlock(wrapper, "Comments").text()).toContain("needed");
    });

    it("opens a block's details from its info button, selecting it on the way", async () => {
        const wrapper = await open();

        expect(document.body.textContent).not.toContain("Moderate comments");

        await wrapper.find("button[aria-label='Details for Comments']").trigger("click");
        await flushPromises();

        expect(document.body.querySelector("[role=dialog]")?.textContent).toContain(
            "Moderate comments",
        );
    });

    it("replays an earlier day, showing work in flight that is done today", async () => {
        const wrapper = await open(
            workflows(PROJECT, [
                ticket(13, "Moderate comments", {
                    caps: ["comments"],
                    state: "closed",
                    reason: "completed",
                    createdAt: "2026-11-01T09:00:00Z",
                    closedAt: "2026-11-05T09:00:00Z",
                    activity: ["2026-11-02"],
                }),
            ]),
        );

        expect(graphBlock(wrapper, "Comments").text()).toContain("Done");

        await wrapper.findComponent({ name: "USlider" }).setValue(0);

        expect(graphBlock(wrapper, "Comments").text()).toContain("In flight");
        expect(wrapper.find("output").text()).toContain("2 Nov");
    });

    it("keeps features, ticket size and deleting behind Settings rather than on the page", async () => {
        editing.editable = true;
        const wrapper = await open();
        const controls = wrapper.findAll("a, button").map((control) => control.text());

        expect(wrapper.find("a[href='/workflows/blog/settings']").exists()).toBe(true);
        expect(controls.filter((label) => /delete|features|ticket size/i.test(label))).toEqual([]);
    });

    it("says so when the project doesn't exist instead of rendering an empty pipeline", async () => {
        const wrapper = await open(workflows(PROJECT), "/workflows/nope");

        expect(wrapper.text()).toContain("No project nope");
    });
});
