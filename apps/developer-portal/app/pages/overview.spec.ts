import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { ref } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IssuesRead } from "#layers/github/shared/issues.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import type { SnapshotResponse } from "#layers/snapshot/shared/types/SnapshotResponse.ts";
import type { Snapshot } from "#layers/workflows/shared/types/Snapshot.ts";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Page from "./index.vue";

// An in-memory docs collection, answering the README query the page sends
const docs = vi.hoisted(() => ({
    readmes: [] as { path: string; title: string; description: string }[],
}));

// GitHub is read straight from the browser, so the github layer's composable is the boundary
const github = vi.hoisted(() => ({ read: null as unknown }));

mockNuxtImport("queryCollection", () => () => {
    const query = { select: () => query, all: () => Promise.resolve(docs.readmes) };
    return query;
});

mockNuxtImport("useIssues", () => () => ({ data: github.read }));

// Each row has its own spec; here only which issues the page picks
const global = {
    stubs: {
        HealthIssueRow: { props: { issue: Object }, template: "<div>{{ issue.title }}</div>" },
    },
};

type Artifacts = Omit<SnapshotResponse, "manifest">;

const app = (name: string): ProjectNode => ({
    name: `@monorepo/${name}`,
    root: `apps/${name}`,
    tags: [],
    dependsOn: [],
    dependedOnBy: [],
});

const TEMPLATE = {
    id: "website-rebuild",
    title: "Website",
    stages: [{ id: "build", title: "Build" }],
    capabilities: [{ id: "page", stage: "build", title: "Page" }],
};

const workflowProject = (id: string) => ({
    file: `projects/${id}.json`,
    ok: true as const,
    value: { id, title: id, template: "website-rebuild", milestone: id, switches: {} },
});

const doneSnapshot = (id: string) => ({
    file: `snapshots/${id}.json`,
    ok: true as const,
    value: {
        syncedAt: "2026-11-01T00:00:00Z",
        milestone: id,
        issues: [
            {
                number: 1,
                title: "Page",
                url: "",
                state: "closed",
                reason: "completed",
                caps: ["page"],
                createdAt: "2026-10-01",
                closedAt: "2026-11-01",
                activity: [],
                blockedBy: [],
                branch: false,
                pr: false,
                owner: false,
                complexity: null,
            },
        ],
        noMilestone: [],
    } satisfies Snapshot,
});

const serve = (artifacts: Artifacts, workflows = assembleWorkflows([], [], {})) => {
    for (const artifact of ["projects", "coverage", "docs", "deps", "metrics", "usage"] as const) {
        serveEndpoint(`/api/snapshot/${artifact}`, (): SnapshotResponse => ({
            manifest: null,
            [artifact]: artifacts[artifact] ?? null,
        }));
    }
    serveEndpoint("/api/workflows", () => workflows);
};

const open = async () => {
    const wrapper = await mountSuspended(Page, { global });
    await flushPromises();
    return wrapper;
};

const tiles = (wrapper: VueWrapper) =>
    Object.fromEntries(
        wrapper
            .findAllComponents({ name: "StatTile" })
            .map((tile) => [tile.props("label"), tile.props()]),
    );

const hrefs = (wrapper: VueWrapper) => wrapper.findAll("a").map((a) => a.attributes("href"));

const projects = (nodes: ProjectNode[]): Artifacts => ({
    projects: { generatedAt: "2026-11-01T00:00:00Z", projects: nodes, retired: [] },
});

beforeEach(() => {
    docs.readmes = [];
    github.read = ref<IssuesRead>({ fetchedAt: "2026-11-01", error: null, issues: [] });
});

describe("overview page", () => {
    it("introduces the repository from its README and links the newcomer routes", async () => {
        docs.readmes = [
            { path: "/readme", title: "Repository overview", description: "What it holds." },
        ];
        serve({});
        const wrapper = await open();

        expect(wrapper.text()).toContain("Repository overview");
        expect(wrapper.text()).toContain("What it holds.");
        expect(hrefs(wrapper)).toEqual(
            expect.arrayContaining(["/projects", "/graph", "/wiki/docs/guides/first-hour"]),
        );
    });

    it("features applications, titled by their README, and never a package", async () => {
        docs.readmes = [
            { path: "/apps/huella-legal/readme", title: "Huella Legal", description: "Law." },
        ];
        serve(
            projects([
                app("huella-legal"),
                { ...app("ui"), name: "@monorepo/ui", root: "packages/ui" },
            ]),
        );
        const wrapper = await open();

        expect(wrapper.text()).toContain("Huella Legal");
        expect(hrefs(wrapper)).toContain("/wiki/apps/huella-legal/readme");
        expect(wrapper.text()).not.toContain("@monorepo/ui");
    });

    it("features at most two applications", async () => {
        serve(projects([app("one"), app("two"), app("three")]));
        const wrapper = await open();

        expect(wrapper.text()).toContain("@monorepo/two");
        expect(wrapper.text()).not.toContain("@monorepo/three");
    });

    it("says the summaries are missing instead of inventing them", async () => {
        serve(projects([app("huella-legal")]));
        const wrapper = await open();

        expect(wrapper.text()).toContain("The repository summary is not available yet.");
        expect(wrapper.text()).toContain("No project description is available yet.");
    });

    it("shows a dash on every tile whose artifact was never collected", async () => {
        serve({});
        const wrapper = await open();

        expect(tiles(wrapper)).toMatchObject({
            Docs: { value: "—" },
            "Line coverage": { value: "—" },
            Vulnerabilities: { value: "—" },
        });
    });

    it("feeds the collected coverage and the live issue count into their tiles", async () => {
        github.read = ref<IssuesRead>({
            fetchedAt: "2026-11-01",
            error: null,
            issues: [
                {
                    number: 4,
                    title: "Open issue",
                    body: "",
                    url: "",
                    labels: [],
                    assignees: [],
                    createdAt: "2026-11-01",
                    updatedAt: "2026-11-01",
                },
            ],
        });
        serve({
            coverage: {
                generatedAt: "2026-11-01T00:00:00Z",
                totals: { lines: 82, statements: 0, functions: 0, branches: 0 },
                report: false,
                projects: [],
            },
        });
        const wrapper = await open();

        expect(tiles(wrapper)["Line coverage"]).toMatchObject({ value: "82%" });
        expect(tiles(wrapper)["Open issues"]).toMatchObject({ value: 1 });
        expect(wrapper.text()).toContain("Open issue");
    });

    it("blanks the issue count and says why when GitHub cannot be read", async () => {
        github.read = ref<IssuesRead>({ fetchedAt: "", error: "offline", issues: [] });
        serve({});
        const wrapper = await open();

        expect(tiles(wrapper)["Open issues"]).toMatchObject({
            value: "—",
            hint: "GitHub could not be read",
        });
    });

    it("links each page with a broken link and lists invariant findings for attention", async () => {
        serve({
            docs: {
                generatedAt: "2026-11-01T00:00:00Z",
                pages: [
                    {
                        path: "docs/a.md",
                        kind: "doc",
                        title: "A",
                        words: 1,
                        updatedAt: null,
                        decisionStatus: null,
                        decisionOutcome: null,
                        decisionSupersededBy: null,
                        audit: null,
                        brokenLinks: [{ href: "./missing", resolved: "docs/missing.md" }],
                    },
                ],
                brokenLinkCount: 1,
            },
            metrics: {
                generatedAt: "2026-11-01T00:00:00Z",
                commit: "abc",
                branch: "master",
                projects: [],
                invariantFindings: [
                    { id: "drift", title: "Drift", detail: "Fix it", evidence: [] },
                ],
                conventionalCommitRate: null,
                commitsSinceLastRelease: null,
            },
        });
        const wrapper = await open();

        expect(hrefs(wrapper)).toContain("/wiki/docs/a");
        expect(wrapper.text()).toContain("Drift");
    });

    it("lists only unfinished workflows and always offers a new one", async () => {
        serve(
            {},
            assembleWorkflows(
                [{ file: "templates/website-rebuild.json", ok: true, value: TEMPLATE }],
                [workflowProject("live"), workflowProject("shipped")],
                { shipped: doneSnapshot("shipped") },
            ),
        );
        const wrapper = await open();

        expect(hrefs(wrapper)).toContain("/workflows/live");
        expect(hrefs(wrapper)).not.toContain("/workflows/shipped");
        expect(hrefs(wrapper)).toContain("/workflows/new");
    });

    it("still offers a new project when none is in progress", async () => {
        serve({});
        const wrapper = await open();

        expect(wrapper.find("a[href='/workflows/new']").attributes("aria-label")).toBe(
            "New project",
        );
    });
});
