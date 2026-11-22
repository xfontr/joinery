import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { ref } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IssuesRead } from "#layers/github/shared/issues.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import type { SnapshotResponse } from "#layers/snapshot/shared/types/SnapshotResponse.ts";
import type { Snapshot } from "#layers/workflows/shared/types/Snapshot.ts";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import type { DashboardLayout } from "~/utils/dashboardLayout";
import Page from "./overview.vue";

// An in-memory docs collection, answering the README queries the Home panels send
const docs = vi.hoisted(() => ({
    readmes: [] as { path: string; title: string; description: string }[],
}));

// GitHub is read straight from the browser, so the github layer's composable is the boundary
const github = vi.hoisted(() => ({ read: null as unknown }));

mockNuxtImport("queryCollection", () => () => {
    let wanted = "";
    const query = {
        path: (path: string) => {
            wanted = path;
            return query;
        },
        select: () => query,
        all: () => Promise.resolve(docs.readmes),
        first: () => Promise.resolve(docs.readmes.find((page) => page.path === wanted) ?? null),
    };
    return query;
});

mockNuxtImport("useIssues", () => () => ({ data: github.read, shown: github.read }));

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
    const wrapper = await mountSuspended(Page);
    await flushPromises();
    return wrapper;
};

const hrefs = (wrapper: VueWrapper) => wrapper.findAll("a").map((a) => a.attributes("href"));

/** Brings back widgets that start in the Add widget list, as a developer would from Customize. */
const restore = (...ids: string[]) =>
    localStorage.setItem(
        "home-layout",
        JSON.stringify({
            version: 1,
            widgets: ids.map((id) => ({ id, size: "medium" as const })),
            hidden: [],
        } satisfies DashboardLayout),
    );

const METRICS = {
    generatedAt: "2026-11-01T00:00:00Z",
    commit: "abc",
    branch: "master",
    projects: [],
    invariantFindings: [],
    conventionalCommitRate: null,
    commitsSinceLastRelease: null,
} satisfies MetricsArtifact;

const unreleased = (name: string, commits: number): ProjectMetrics => ({
    name: `@monorepo/${name}`,
    root: `packages/${name}`,
    specs: 0,
    commits: null,
    commitsLastTwoWeeks: null,
    coverageLinesPct: null,
    unreleasedCommits: commits,
    currentVersion: "1.0.0",
    hasChangelog: true,
});

/** Each Health line's label and figure. */
const health = (wrapper: VueWrapper) =>
    Object.fromEntries(
        wrapper.findAll("dl > div").flatMap((line) => {
            const [label, figure] = [line.find("dt"), line.find("dd")];
            return label.exists() && figure.exists() ? [[label.text(), figure.text()]] : [];
        }),
    );

const projects = (nodes: ProjectNode[]): Artifacts => ({
    projects: { generatedAt: "2026-11-01T00:00:00Z", projects: nodes, retired: [] },
});

beforeEach(() => {
    docs.readmes = [];
    github.read = ref<IssuesRead>({ fetchedAt: "2026-11-01", error: null, issues: [] });
});

afterEach(() => {
    localStorage.clear();
});

describe("home page", () => {
    it("queues unreleased projects by how far behind they are, each linking to its page", async () => {
        serve({
            metrics: {
                ...METRICS,
                projects: [unreleased("small", 2), unreleased("big", 9)],
            },
        });
        const wrapper = await open();
        const queue = hrefs(wrapper).filter((href) => href?.startsWith("/projects/"));

        expect(queue).toEqual(["/projects/big", "/projects/small"]);
    });

    it("narrows the queue to one kind of work when its filter is picked", async () => {
        serve({
            metrics: {
                ...METRICS,
                projects: [unreleased("lib", 3)],
                invariantFindings: [
                    { id: "drift", title: "Drift", detail: "Fix it", evidence: [] },
                ],
            },
        });
        const wrapper = await open();

        await wrapper.findComponent({ name: "UTabs" }).setValue("attention");

        expect(wrapper.text()).toContain("Drift");
        expect(hrefs(wrapper)).not.toContain("/projects/lib");
    });

    it("puts a dash on every Health figure whose artifact was never collected", async () => {
        serve({});
        const wrapper = await open();

        expect(health(wrapper)).toMatchObject({
            "Line coverage": "—",
            Advisories: "—",
            "Tooling runs failed": "—",
            "Doc pages": "—",
        });
    });

    it("reads the Health figures from the snapshot", async () => {
        serve({
            coverage: {
                generatedAt: "",
                totals: { lines: 82, statements: 0, functions: 0, branches: 0 },
                report: false,
                projects: [],
            },
            deps: {
                generatedAt: "",
                vulnerabilities: { info: 0, low: 1, moderate: 0, high: 2, critical: 0 },
                totalDependencies: 10,
                advisories: [],
                outdated: [],
            },
        });
        const wrapper = await open();

        expect(health(wrapper)).toMatchObject({ "Line coverage": "82%", Advisories: "0" });
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

    // The visitor front page carries these two, so they start in the Add widget list.
    describe("once the welcome and featured widgets are added back", () => {
        beforeEach(() => {
            restore("welcome", "featured");
        });

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
    });
});
