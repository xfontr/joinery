import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { NuxtPage } from "#components";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SnapshotIssue } from "#layers/workflows/shared/types/SnapshotIssue.ts";
import { assembleWorkflows, type Workflows } from "#layers/workflows/shared/workflows.ts";

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
        wordmark: "monorepo",
    },
    settingsFeatures: {
        hint: "Leaving one out takes its blocks out of the map; whatever needed them waits on what they needed.",
        title: "Features",
    },
    settingsGeneral: {
        area: "Area label",
        hint: "What the project is called and where its tickets live.",
        milestone: {
            help: "Rename it on GitHub too, or its tickets drop out of view",
            label: "Milestone",
        },
        summary: "Summary",
        template:
            "Template: {template}. It can't change, since the switches and settled blocks belong to it.",
        title: "General",
        titleField: "Title",
    },
    settingsReadOnly: {
        description:
            "Settings write the project file, so they change only under pnpm dev developer-portal.",
        title: "Read-only here",
    },
    settingsRemove: {
        cancel: "Cancel",
        confirm: "Type {project} to confirm",
        delete: "Delete project",
        deleteOpen: "Delete project…",
        drop: "As of the last sync, {close} tickets are untouched and {keep} already started or closed. Close the untouched ones first with {command}, since it reads the milestone from this project file.",
        lead: "Removes the project file and its snapshot. Run {command} first to close the tickets nobody started; the rest stay on GitHub.",
        modal: {
            description: "The project file and its snapshot go. Deleting closes nothing on GitHub.",
            title: "Delete {title}?",
        },
        rarely: "Rarely needed.",
        title: "Remove",
    },
    settingsSave: {
        discard: "Discard",
        save: "Save",
        unsaved: "Unsaved changes",
    },
    settingsTicketSize: {
        hint: "How many blocks share a ticket when filed. It can't change once one is.",
        title: "Ticket size",
    },
    ticketSize: {
        block: {
            summary: "One ticket per block, or its suggested ones, each PR reviewed by hand",
            title: "Reviewed",
        },
        fast: {
            summary: "Tickets of up to {width} SP, and the spikes together; sign-offs stay apart",
            title: "Fast",
        },
        supervised: {
            summary:
                "A stage's build blocks share tickets of up to {width} SP; spikes and sign-offs stay apart",
            title: "Supervised",
        },
    },
    workflow: {
        fallback: "Workflow",
    },
    workflowFeaturePicker: {
        points: "{points} SP",
    },
    workflowLeaveModal: {
        stay: "Stay",
    },
    workflowNewProjectCard: {
        label: "New project",
    },
    workflowProjects: {
        title: "Projects",
    },
    workflowSettings: {
        back: "Back to the project",
        leave: {
            action: "Leave without saving",
            description: "The changes on this page aren't in the project file yet.",
            title: "Leave without saving?",
        },
        titleOf: "{project} · Settings",
    },
    workflowTemplates: {
        title: "Templates",
    },
    workflowTicketSizePicker: {
        legend: "Ticket size",
        tickets: "tickets | ticket | tickets",
    },
    workflows: {
        crumb: "workflows",
        guide: "How workflows work",
        intro: "A workflow is a map of every block a kind of project needs and what each one needs first, learned from the ones already shipped. Each project picks its features, files the blocks as GitHub tickets with their blocked-by links, and from then on GitHub says where it stands.",
        title: "Workflows",
    },
};

const editing = vi.hoisted(() => ({ editable: true, edit: vi.fn() }));
mockNuxtImport("useWorkflowEdit", () => () => editing);

const TEMPLATE = {
    id: "site",
    title: "Site",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [
        { id: "search", stage: "build", title: "Search", optional: true, default: false },
    ],
};

const PROJECT = { id: "blog", title: "Blog", template: "site", milestone: "Blog" };

const ticket = (number: number, overrides: Partial<SnapshotIssue> = {}): SnapshotIssue => ({
    number,
    title: `Ticket ${number}`,
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

const workflows = (issues?: SnapshotIssue[]): Workflows =>
    assembleWorkflows(
        [{ file: "site.yaml", ok: true, value: TEMPLATE }],
        [{ file: "blog.yaml", ok: true, value: PROJECT }],
        issues
            ? {
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
              }
            : {},
    );

const Routed = defineComponent({ render: () => h(NuxtPage) });

const open = async (data = workflows()) => {
    serveEndpoint("/api/workflows", () => data);
    const wrapper = await mountSuspended(Routed, { route: "/workflows/blog/settings" });
    await flushPromises();
    return wrapper;
};

const button = (wrapper: VueWrapper, label: string) =>
    wrapper.findAll("button").find((candidate) => candidate.text() === label);

const dialog = () => document.body.querySelector<HTMLElement>("[role=dialog]");

const press = async (label: string) => {
    [...(dialog()?.querySelectorAll("button") ?? [])]
        .find((candidate) => candidate.textContent?.trim() === label)!
        .click();
    await flushPromises();
};

const path = () => useRouter().currentRoute.value.path;

const landsOn = (target: string) => vi.waitFor(() => expect(path()).toBe(target));

beforeEach(() => {
    editing.editable = true;
    editing.edit.mockReset().mockResolvedValue(true);
});

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("project settings", () => {
    it("deletes only once the project's id is typed back, then returns to the list", async () => {
        const wrapper = await open();

        await button(wrapper, "Delete project…")!.trigger("click");
        await flushPromises();
        const confirm = () =>
            [...dialog()!.querySelectorAll("button")].find(
                (candidate) => candidate.textContent?.trim() === "Delete project",
            )!;

        expect(confirm().disabled).toBe(true);

        const input = dialog()!.querySelector("input")!;
        input.value = "blog";
        input.dispatchEvent(new Event("input"));
        await flushPromises();
        await press("Delete project");

        expect(editing.edit).toHaveBeenCalledWith({ action: "delete", project: "blog" });
        await landsOn("/workflows");
    });

    it("writes nothing until Save, then sends every setting in one edit", async () => {
        const wrapper = await open();

        await wrapper.find("[role='switch']").trigger("click");

        expect(editing.edit).not.toHaveBeenCalled();

        await button(wrapper, "Save")!.trigger("click");

        expect(editing.edit).toHaveBeenCalledWith({
            action: "settings",
            project: "blog",
            title: "Blog",
            summary: "",
            milestone: "Blog",
            area: "",
            switches: { search: true },
            ticketSize: "block",
        });
    });

    it("lets a page with nothing unsaved be left at once", async () => {
        await open();

        await useRouter().push("/workflows");

        await vi.waitFor(() => expect(path()).toBe("/workflows"));
    });

    it("holds a navigation away from unsaved changes until the user leaves anyway", async () => {
        const wrapper = await open();
        await wrapper.find("[role='switch']").trigger("click");

        await useRouter().push("/workflows");
        await flushPromises();

        expect(path()).toBe("/workflows/blog/settings");

        await press("Leave without saving");

        await landsOn("/workflows");
        expect(editing.edit).not.toHaveBeenCalled();
    });

    it("locks every ticket size once a labelled ticket is in the milestone", async () => {
        const wrapper = await open(workflows([ticket(1, { caps: ["search"] })]));
        const sizes = wrapper
            .findAll("fieldset")
            .find((group) => group.find("legend").text() === "Ticket size")!
            .findAll("input[type='radio']");

        expect(sizes).toHaveLength(3);
        expect(sizes.every((size) => size.attributes("disabled") !== undefined)).toBe(true);
    });

    it("points at workflow:drop before deleting, since the drop needs the project file", async () => {
        const wrapper = await open(
            workflows([
                ticket(1),
                ticket(2, { blockedBy: [{ number: 1, open: true, closedAt: null }] }),
                ticket(3, { owner: true }),
                ticket(4, { branch: true }),
                ticket(5, { pr: true }),
                ticket(6, { state: "closed", reason: "completed" }),
                ticket(7, { state: "closed", reason: "not_planned" }),
            ]),
        );

        await button(wrapper, "Delete project…")!.trigger("click");
        await flushPromises();

        expect(dialog()?.textContent).toContain(
            "3 tickets are untouched and 4 already started or closed",
        );
        expect(dialog()?.textContent).toContain("pnpm workflow:drop blog --yes");
    });

    it("offers no delete on the static site", async () => {
        editing.editable = false;
        const wrapper = await open();

        expect(button(wrapper, "Delete project…")).toBeUndefined();
    });
});
