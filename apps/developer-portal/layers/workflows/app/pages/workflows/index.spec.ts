import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
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
        wordmark: "joinery",
    },
    workflowNewProjectCard: {
        label: "New project",
    },
    workflowProjects: {
        empty: "No project under {folder} yet.",
        title: "Projects",
    },
    workflowTemplates: {
        title: "Templates",
    },
    workflows: {
        guide: "How workflows work",
        intro: "A workflow is a map of every block a kind of project needs and what each one needs first, learned from the ones already shipped. Each project picks its features, files the blocks as GitHub tickets with their blocked-by links, and from then on GitHub says where it stands.",
        title: "Workflows",
    },
};

const TEMPLATE = {
    id: "website-rebuild",
    title: "Website rebuild",
    stages: [
        { id: "discovery", title: "Discovery" },
        { id: "build", title: "Build" },
    ],
    capabilities: [
        { id: "content-audit", stage: "discovery", title: "Content audit" },
        { id: "comments", stage: "build", title: "Comments", optional: true },
    ],
};

const workflows = (projects: object[], snapshots = {}) =>
    assembleWorkflows(
        [{ file: "website-rebuild.yaml", ok: true, value: TEMPLATE }],
        projects.map((value, index) => ({ file: `p${index}.yaml`, ok: true, value })),
        snapshots,
    );

const ticket = (number: number, overrides: Partial<SnapshotIssue> = {}): SnapshotIssue => ({
    number,
    title: "T",
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

const open = async (data: Workflows) => {
    serveEndpoint("/api/workflows", () => data);
    const wrapper = await mountSuspended(Page);
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("workflows page", () => {
    it("puts the project's own done count on its card, never another's", async () => {
        const wrapper = await open(
            workflows(
                [
                    {
                        id: "p0",
                        title: "Blog",
                        template: "website-rebuild",
                        milestone: "Blog",
                        ticketSize: "fast",
                        switches: { comments: true },
                    },
                ],
                {
                    p0: {
                        file: "p0.snapshot.json",
                        ok: true,
                        value: {
                            syncedAt: "2026-11-09T00:00:00Z",
                            milestone: "Blog",
                            issues: [
                                ticket(1, { caps: ["content-audit"] }),
                                ticket(2, { caps: ["comments"], branch: true }),
                            ],
                            noMilestone: [],
                        },
                    },
                },
            ),
        );

        const card = wrapper.find("a[href='/workflows/p0']");

        expect(card.text()).toContain("0 of 2 done");
    });

    it("offers a new project on the static site too, where the wizard ends in a download", async () => {
        const wrapper = await open(workflows([]));

        expect(wrapper.find("a[href='/workflows/new']").attributes("aria-label")).toBe(
            "New project",
        );
    });
});
