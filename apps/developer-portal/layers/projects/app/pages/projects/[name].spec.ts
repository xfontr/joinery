import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CoverageArtifact } from "#layers/snapshot/shared/types/CoverageArtifact.ts";
import type { DepsArtifact } from "#layers/snapshot/shared/types/DepsArtifact.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { OutdatedPackage } from "#layers/snapshot/shared/types/OutdatedPackage.ts";
import type { ProjectCoverage } from "#layers/snapshot/shared/types/ProjectCoverage.ts";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import type { ProjectTabRow } from "~/types/ProjectTabRow";
import type { ProjectsArtifact } from "#layers/snapshot/shared/types/ProjectsArtifact.ts";
import Page from "./[name].vue";

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
    appTabs: {
        label: "{app} sections",
    },
    common: {
        metrics: {
            lines: "lines",
        },
        shortAge: {
            days: "{count} d",
        },
    },
    issuesRead: {
        noRepo: "NUXT_PUBLIC_REPO_URL is unset, so there is no repo to read.",
    },
    pageHeader: {
        breadcrumb: "Breadcrumb",
        wordmark: "monorepo",
    },
    project: {
        missing: {
            description: "No collected project lives in a folder called {name}.",
            title: "No such project",
        },
        noReadme: "This project has no README.",
        tabs: {
            coverage: "Coverage",
            deps: "Dependencies",
            issues: "Issues",
            readme: "README",
        },
    },
    projectAbout: {
        facts: {
            changelog: "Changelog",
            lines: "Lines covered",
            recent: "Commits, 2 wk",
            specs: "Specs",
            unreleased: "Unreleased",
            version: "Version",
        },
        no: "no",
        relations: {
            dependsOn: "Depends on",
            usedBy: "Used by",
        },
        tags: "Tags",
        title: "About",
        yes: "yes",
    },
    projectCoverageTab: {
        meta: "Vitest · {files} files · collected {age}",
        parts: {
            covered: "covered",
            uncovered: "not covered",
        },
        title: "Coverage",
    },
    projectDepsTab: {
        columns: {
            current: "Current",
            latest: "Latest",
            package: "Package",
            wanted: "Wanted",
        },
        meta: "pnpm outdated · collected {age} · advisories are workspace-wide",
        title: "Outdated dependencies",
    },
    projectExtraTab: {
        meta: "Running in {name}",
        parts: {
            done: "done",
            left: "to go",
        },
    },
    projectIssuesTab: {
        meta: "GitHub · labelled {area}",
        reading: "Reading GitHub…",
        readingIssues: "Reading open issues…",
        title: "Open issues",
    },
    projectTabs: {
        workflows: {
            empty: "No workflow runs in this project.",
            label: "Workflows",
        },
    },
    projects: {
        crumb: "projects",
    },
};

const artifacts = vi.hoisted(() => ({
    coverage: null as CoverageArtifact | null,
    deps: null as DepsArtifact | null,
    metrics: null as MetricsArtifact | null,
    projects: null as ProjectsArtifact | null,
}));
mockNuxtImport("coverageArtifact", () => () => artifacts.coverage);
mockNuxtImport("depsArtifact", () => () => artifacts.deps);
mockNuxtImport("metricsArtifact", () => () => artifacts.metrics);
mockNuxtImport("projectsArtifact", () => () => artifacts.projects);

beforeEach(() => {
    artifacts.coverage = null;
    artifacts.deps = null;
    artifacts.metrics = null;
    artifacts.projects = null;
});

const docs = vi.hoisted(() => ({
    readmes: [] as { path: string; title: string; description: string }[],
}));

mockNuxtImport("queryCollection", () => () => {
    const query = {
        select: () => query,
        path: () => query,
        all: () => Promise.resolve(docs.readmes),
        first: () => Promise.resolve(null),
    };
    return query;
});

const ISSUES_API = "https://api.github.com/repos/acme/repo/issues";

const node = (name: string, root: string, links: Partial<ProjectNode> = {}): ProjectNode => ({
    name,
    root,
    tags: [],
    dependsOn: [],
    dependedOnBy: [],
    ...links,
});

const metric = (name: string, values: Partial<ProjectMetrics>): ProjectMetrics => ({
    name,
    root: "",
    specs: 0,
    commits: null,
    commitsLastTwoWeeks: null,
    coverageLinesPct: null,
    unreleasedCommits: null,
    currentVersion: null,
    hasChangelog: false,
    ...values,
});

const outdatedPackage = (name: string, dependents: string[]): OutdatedPackage => ({
    name,
    current: "1.0.0",
    wanted: "1.0.1",
    latest: "2.0.0",
    isDeprecated: false,
    dependents,
});

const UI = node("@monorepo/ui", "packages/UI", {
    dependsOn: ["@monorepo/configs"],
    dependedOnBy: ["@monorepo/developer-portal"],
});
const CONFIGS = node("@monorepo/configs", "packages/configs");

const serve = ({
    projects = [UI, CONFIGS],
    metrics = [],
    coverage = [],
    outdated = [],
    workflows = {},
}: {
    projects?: ProjectNode[];
    metrics?: ProjectMetrics[];
    coverage?: ProjectCoverage[];
    outdated?: OutdatedPackage[];
    workflows?: Record<string, ProjectTabRow[]>;
} = {}) => {
    serveEndpoint("/api/workflows/areas", () => workflows);
    artifacts.projects = { generatedAt: "2026-11-01T00:00:00Z", projects, retired: [] };
    artifacts.metrics = {
        generatedAt: "2026-11-01T00:00:00Z",
        commit: "abc",
        branch: "master",
        projects: metrics,
        invariantFindings: [],
        conventionalCommitRate: null,
        commitsSinceLastRelease: null,
    } satisfies MetricsArtifact;
    artifacts.coverage = {
        generatedAt: "2026-11-01T00:00:00Z",
        totals: null,
        report: false,
        projects: coverage,
    } satisfies CoverageArtifact;
    artifacts.deps = {
        generatedAt: "2026-11-01T00:00:00Z",
        vulnerabilities: null,
        totalDependencies: null,
        advisories: [],
        outdated,
    } satisfies DepsArtifact;
};

/** Each About fact by its label, the count beside a list label left out. */
const facts = (wrapper: VueWrapper) =>
    Object.fromEntries(
        wrapper
            .findAll("aside dl > div")
            .map((fact) => [
                fact.find("dt").element.firstChild?.textContent?.trim(),
                fact.findAll("dd").map((dd) => dd.text()),
            ]),
    );

/** Each tab's link, whether it is current, and the count beside it. */
const tabs = (wrapper: VueWrapper) =>
    wrapper.findAll("nav[aria-label$='sections'] a").map((tab) => ({
        to: tab.attributes("href"),
        current: tab.attributes("aria-current") ?? null,
        count: tab.find("span").exists() ? tab.find("span").text() : null,
    }));

afterEach(() => {
    docs.readmes = [];
    useRuntimeConfig().public.repoUrl = "";
});

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("project page", () => {
    it("links what a project depends on and what uses it to their own pages", async () => {
        serve();
        const wrapper = await mountSuspended(Page, { route: "/projects/UI" });

        expect(facts(wrapper)["Depends on"]).toEqual(["@monorepo/configs"]);
        expect(facts(wrapper)["Used by"]).toEqual(["@monorepo/developer-portal"]);
        expect(wrapper.find("a[href='/projects/configs']").exists()).toBe(true);
    });

    it("prints each fact with its unit and a dash where nothing was measured", async () => {
        serve({
            metrics: [
                metric("@monorepo/ui", { unreleasedCommits: 3, specs: 2, hasChangelog: true }),
            ],
            coverage: [
                {
                    name: "@monorepo/ui",
                    root: "packages/UI",
                    collected: true,
                    files: 4,
                    lines: { pct: 90, covered: 90, total: 100 },
                },
            ],
        });
        const wrapper = await mountSuspended(Page, { route: "/projects/UI" });

        expect(facts(wrapper)).toMatchObject({
            Version: ["—"],
            Unreleased: ["+3"],
            "Commits, 2 wk": ["—"],
            Specs: ["2"],
            "Lines covered": ["90%"],
            Changelog: ["yes"],
        });
    });

    it("opens on the README and links every other tab with its count", async () => {
        serve({ outdated: [outdatedPackage("vue", ["packages/UI"])] });
        const wrapper = await mountSuspended(Page, { route: "/projects/UI" });

        expect(tabs(wrapper)).toEqual([
            { to: "/projects/UI", current: "page", count: null },
            { to: "/projects/UI?tab=coverage", current: null, count: null },
            { to: "/projects/UI?tab=deps", current: null, count: "1" },
            { to: "/projects/UI?tab=issues", current: null, count: "0" },
            { to: "/projects/UI?tab=workflows", current: null, count: "0" },
        ]);
        expect(wrapper.find("[data-readme]").exists()).toBe(true);
    });

    it("splits each coverage metric into covered and not covered", async () => {
        serve({
            coverage: [
                {
                    name: "@monorepo/ui",
                    root: "packages/UI",
                    collected: true,
                    files: 4,
                    lines: { pct: 75, covered: 30, total: 40 },
                },
            ],
        });
        const wrapper = await mountSuspended(Page, { route: "/projects/UI?tab=coverage" });

        expect(wrapper.text()).toContain("75%");
        expect(wrapper.text()).toContain("30 covered");
        expect(wrapper.text()).toContain("10 not covered");
    });

    it("lists only the outdated packages this project depends on", async () => {
        serve({
            outdated: [
                outdatedPackage("vue", ["packages/UI"]),
                outdatedPackage("yaml", ["packages/configs"]),
            ],
        });
        const wrapper = await mountSuspended(Page, { route: "/projects/UI?tab=deps" });

        const rows = wrapper.findAll("tbody tr").map((row) => row.find("td").text());
        expect(rows).toEqual(["vue"]);
    });

    it("lists only the open issues labelled with the project's area", async () => {
        useRuntimeConfig().public.repoUrl = "https://github.com/acme/repo";
        const issue = (number: number, label: string) => ({
            number,
            title: `Issue ${number}`,
            body: "",
            html_url: `https://github.com/acme/repo/issues/${number}`,
            labels: [{ name: label }],
            assignees: [],
            created_at: "2026-11-01T00:00:00Z",
            updated_at: "2026-11-01T00:00:00Z",
        });
        serveEndpoint(ISSUES_API, () => [issue(1, "package:UI"), issue(2, "app:huella-legal")]);
        serve();
        const wrapper = await mountSuspended(Page, { route: "/projects/UI?tab=issues" });

        await vi.waitFor(() => expect(wrapper.findAll("a[href*='/issues/']").length).toBe(1));
        expect(wrapper.find("a[href$='/issues/1']").exists()).toBe(true);
    });

    it("lists the workflows running in this project from the tab the workflows layer adds", async () => {
        serve({
            workflows: {
                UI: [
                    {
                        id: "kit",
                        title: "UI kit",
                        to: "/workflows/kit",
                        percent: 25,
                        done: 1,
                        left: 3,
                    },
                ],
                configs: [
                    {
                        id: "lint",
                        title: "Lint",
                        to: "/workflows/lint",
                        percent: 0,
                        done: 0,
                        left: 2,
                    },
                ],
            },
        });
        const wrapper = await mountSuspended(Page, { route: "/projects/UI?tab=workflows" });

        expect(wrapper.find("a[href='/workflows/kit']").exists()).toBe(true);
        expect(wrapper.find("a[href='/workflows/lint']").exists()).toBe(false);
        expect(wrapper.text()).toContain("3 to go");
    });

    it("names the folder it could not find instead of rendering an empty project", async () => {
        serve();
        const wrapper = await mountSuspended(Page, { route: "/projects/nowhere" });

        expect(wrapper.text()).toContain("nowhere");
        expect(wrapper.find("aside").exists()).toBe(false);
    });
});
