import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, onTestFinished, vi } from "vitest";
import type { SnapshotIssue } from "#layers/workflows/shared/types/SnapshotIssue.ts";
import { assembleWorkflows, type Workflows } from "#layers/workflows/shared/workflows.ts";
import Page from "./index.vue";

const MESSAGES = {
    app: {
        apps: {
            catalog: "Catalog",
            docs: "Docs",
            health: "Health",
            home: "Home",
            work: "Work",
        },
        nav: {
            audits: "Audits",
            benchmarks: "Benchmarks",
            changelog: "What's new",
            coverage: "Coverage",
            decisions: "Decisions",
            deps: "Dependencies",
            docs: "Documentation",
            graph: "Architecture",
            issues: "Work in progress",
            overview: "Overview",
            projects: "Projects",
            telemetry: "Tooling usage",
            workflows: "Workflows",
        },
    },
    pageHeader: {
        breadcrumb: "Breadcrumb",
        wordmark: "joinery",
    },
    workflow: {
        fallback: "Workflow",
    },
    workflowBlock: {
        hide: "Hide the block",
    },
    workflowPane: {
        show: "Show the pane",
    },
    workflowActions: {
        never: "Never synced — run {setup} then {sync}",
        settings: "Settings",
        synced: "Snapshot updated {age}",
    },
    workflowActivityStrip: {
        moved: "{count} capabilities | {count} capability | {count} capabilities",
        segment: "{stage} · {day} · {moved}",
        tooltip: "Capabilities moved per day, from commits tagged with a ticket number",
    },
    workflowAlerts: {
        blank: {
            description:
                "Ask Claude to draft its map: it asks what the project is, writes the blocks under {extras} in {file}, and they show here for you to check before anything is filed.",
            title: "This project has no blocks yet",
        },
    },
    workflowCapabilityDetail: {
        headings: {
            needs: "Needs",
            tickets: "Tickets",
            unblocks: "Unblocks",
        },
        optional: "Optional",
        why: {
            ready: "Nothing open blocks it, so an agent can take it.",
        },
    },
    workflowGraph: {
        fit: "Fit the selected path",
        full: "Full screen",
        node: "{title}, {state}",
        relation: {
            needed: "needed",
            waits: "waits on it",
        },
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
    },
    workflowLeft: {
        blocks: "{state} blocks",
        none: "No blocks yet.",
        unblocks: "unblocks {count}",
    },
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
        activity: "Active on {days} days, last on {day}",
        dot: "#{number} {title} · {status}",
        progress: "{done} of {total} · {points}",
        stagePoints: "{done}/{total} SP",
        summary: "{count} {status}",
    },
    workflowSummary: {
        done: "{done} of {total} done",
        milestone: "Milestone {milestone}",
        points: "{done} of {total} SP done",
        tickets: "{blocks} blocks · {filed} tickets filed · {toFile} to file",
        unestimated: "{count} unestimated",
    },
    workflows: {
        capabilityState: {
            "can-file": "Can file now",
            done: "Done",
            "in-flight": "In flight",
            ready: "Ready",
        },
        crumb: "workflows",
        missing: "No project {id} under {folder}.",
        ticketStatus: {
            "in-flight": "In flight",
            ready: "Ready",
        },
    },
};

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

/** happy-dom's handle on its window, which `xl` media queries read their width from. */
interface HappyDOM {
    setViewport: (size: { width: number; height: number }) => void;
}

/** The block pane, which shows whichever block is selected. */
const pane = (wrapper: VueWrapper) => wrapper.findComponent({ name: "WorkflowBlock" });

const graphBlock = (wrapper: VueWrapper, title: string) =>
    wrapper.findComponent({ name: "WorkflowGraph" }).find(`button[aria-label^='${title},']`);

beforeEach(() => {
    editing.editable = false;
    editing.edit.mockReset();
    localStorage.clear();
});

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("workflow page", () => {
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

    it("lights a block picked from its state's list on its stage cards and in the pane", async () => {
        const wrapper = await open();

        const list = await blocksIn(wrapper, "can file now");
        [...list.querySelectorAll("button")]
            .find((button) => button.textContent?.trim().startsWith("Cutover"))!
            .click();

        await vi.waitFor(() => expect(pane(wrapper).find("h2").text()).toBe("Cutover"));
        expect(wrapper.find("#stage-launch button[aria-pressed='true']").text()).toContain(
            "Cutover",
        );
    });

    it("lights a picked block's path on the graph view", async () => {
        const wrapper = await open(workflows(PROJECT), "/workflows/blog?view=map&block=cutover");

        expect(graphBlock(wrapper, "Cutover").attributes("aria-pressed")).toBe("true");
        expect(graphBlock(wrapper, "Comments").text()).toContain("needed");
    });

    it("shows a block's details on a plain click on its card, with no second button", async () => {
        const wrapper = await open();

        expect(pane(wrapper).exists()).toBe(false);

        await wrapper
            .findAll("ol button")
            .find((button) => button.text().includes("Launch"))!
            .trigger("click");
        await wrapper.find("#stage-launch button[aria-pressed]").trigger("click");

        await vi.waitFor(() => expect(pane(wrapper).find("h2").text()).toBe("Cutover"));
        // happy-dom's window is narrower than `xl`, where the pane slides over the board instead.
        expect(document.body.querySelector("[role=dialog]")?.textContent).toContain("Cutover");
        expect(useRouter().currentRoute.value.query.block).toBe("cutover");
    });

    it("opens the block a pasted link names", async () => {
        const wrapper = await open(workflows(PROJECT), "/workflows/blog?block=cutover");

        expect(pane(wrapper).find("h2").text()).toBe("Cutover");
    });

    it("hides the pane without dropping the selection, and grows it back from the corner button", async () => {
        const viewport = (window as unknown as { happyDOM: HappyDOM }).happyDOM;
        viewport.setViewport({ width: 1440, height: 900 });
        onTestFinished(() => viewport.setViewport({ width: 1024, height: 768 }));
        const wrapper = await open(workflows(PROJECT), "/workflows/blog?block=cutover");
        const corner = () => wrapper.find("button[aria-label='Show the pane']");
        expect(corner().attributes("aria-hidden")).toBe("true");

        await pane(wrapper).find("button[aria-label='Hide the block']").trigger("click");

        expect(pane(wrapper).exists()).toBe(false);
        expect(useRouter().currentRoute.value.query.block).toBe("cutover");
        expect(wrapper.find("#stage-launch button[aria-pressed='true']").exists()).toBe(true);

        expect(corner().attributes("aria-hidden")).toBeUndefined();
        await corner().trigger("click");

        expect(pane(wrapper).find("h2").text()).toBe("Cutover");
    });

    it("opens a hidden pane again for the first block picked after the selection was cleared", async () => {
        const viewport = (window as unknown as { happyDOM: HappyDOM }).happyDOM;
        viewport.setViewport({ width: 1440, height: 900 });
        onTestFinished(() => viewport.setViewport({ width: 1024, height: 768 }));
        const wrapper = await open(workflows(PROJECT), "/workflows/blog?block=cutover");
        await pane(wrapper).find("button[aria-label='Hide the block']").trigger("click");
        await wrapper.find("#stage-launch button[aria-pressed='true']").trigger("click");
        await vi.waitFor(() => expect(useRouter().currentRoute.value.query.block).toBeUndefined());
        await wrapper.find("ol button[aria-label^='Cutover,']").trigger("click");

        await vi.waitFor(() => expect(pane(wrapper).find("h2").text()).toBe("Cutover"));
    });

    it("clears the selection and closes the pane on a second click on the same block", async () => {
        const wrapper = await open(workflows(PROJECT), "/workflows/blog?block=cutover");

        await wrapper.find("#stage-launch button[aria-pressed='true']").trigger("click");

        await vi.waitFor(() => expect(pane(wrapper).exists()).toBe(false));
        expect(useRouter().currentRoute.value.query.block).toBeUndefined();
        expect(wrapper.find("#stage-launch button[aria-pressed='true']").exists()).toBe(false);
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
            "/workflows/blog?view=map",
        );

        expect(graphBlock(wrapper, "Comments").text()).toContain("Done");

        await wrapper
            .find("button:has(.i-lucide-chart-column), button:has([class*='chart-column'])")
            .trigger("click");
        await wrapper.findComponent({ name: "USlider" }).setValue(0);

        expect(graphBlock(wrapper, "Comments").text()).toContain("In flight");
        expect(wrapper.find("output").text()).toContain("2 Nov");
    });

    it("says so when the project doesn't exist instead of rendering an empty pipeline", async () => {
        const wrapper = await open(workflows(PROJECT), "/workflows/nope");

        expect(wrapper.text()).toContain("No project nope");
    });
});
