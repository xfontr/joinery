import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import Page from "./changelog.vue";

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
    changelog: {
        empty: {
            hint: "They are written by {command}, never by hand.",
            title: "No CHANGELOG.md in the workspace yet.",
        },
        intro: "This page brings together generated release histories and unreleased activity across the workspace.",
        sinceRelease: "{count} commits since the last release",
        title: "What's new",
    },
    changelogList: {
        unreleased: "+{count} unreleased",
        version: "v{version}",
    },
    changelogNotes: {
        conventional: {
            description: "{percent}% of the last 100 commits parse as a version bump.",
            title: "Conventional subjects",
        },
        unreleased: {
            description: "{projects} — commits waiting on a first release, so no changelog yet.",
            title: "Never released",
        },
    },
    pageHeader: {
        wordmark: "joinery",
    },
};

const artifacts = vi.hoisted(() => ({ metrics: null as MetricsArtifact | null }));
mockNuxtImport("metricsArtifact", () => () => artifacts.metrics);

beforeEach(() => {
    artifacts.metrics = null;
});

const docs = vi.hoisted(() => ({
    changelogs: [] as { path: string; title: string }[],
    pages: {} as Record<string, { title: string }>,
}));

mockNuxtImport("queryCollection", () => () => {
    const query = {
        where: () => query,
        select: () => query,
        all: () => Promise.resolve(docs.changelogs),
        path: (path: string) => ({ first: () => Promise.resolve(docs.pages[path] ?? null) }),
    };
    return query;
});

const global = {
    stubs: {
        ContentRenderer: { props: { value: Object }, template: "<div>{{ value?.title }}</div>" },
    },
};

const project = (root: string, metrics: Partial<ProjectMetrics>): ProjectMetrics => ({
    name: root,
    root,
    specs: 0,
    commits: null,
    commitsLastTwoWeeks: null,
    coverageLinesPct: null,
    unreleasedCommits: null,
    currentVersion: null,
    hasChangelog: false,
    ...metrics,
});

const METRICS = {
    generatedAt: "2026-11-01T00:00:00Z",
    commit: "abc",
    branch: "master",
    projects: [],
    invariantFindings: [],
    conventionalCommitRate: null,
    commitsSinceLastRelease: 0,
} satisfies MetricsArtifact;

const serve = (metrics: Partial<MetricsArtifact> = {}) => {
    artifacts.metrics = { ...METRICS, ...metrics };
};

const entries = (wrapper: VueWrapper) =>
    wrapper.findAll("button").filter((button) => button.find(".font-mono").exists());

const alert = (wrapper: VueWrapper, title: string) =>
    wrapper.findAllComponents({ name: "UAlert" }).find((found) => found.props("title") === title);

beforeEach(() => {
    docs.changelogs = [];
    docs.pages = {};
});

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("changelog page", () => {
    it("says the workspace has no changelog yet instead of an empty list", async () => {
        serve();
        const wrapper = await mountSuspended(Page, { global });

        expect(wrapper.text()).toContain("No CHANGELOG.md in the workspace yet.");
        expect(entries(wrapper)).toHaveLength(0);
    });

    it("lists each changelog by project with its version and unreleased commits", async () => {
        docs.changelogs = [{ path: "/packages/ui/CHANGELOG", title: "UI" }];
        serve({
            projects: [project("packages/ui", { currentVersion: "3.2.1", unreleasedCommits: 4 })],
        });
        const wrapper = await mountSuspended(Page, { global });

        const [entry] = entries(wrapper);

        expect(entries(wrapper)).toHaveLength(1);
        expect(entry!.find(".font-mono").text()).toBe("UI");
        expect(entry!.text()).toContain("v3.2.1");
        expect(entry!.find(".tone-warn").text()).toBe("+4 unreleased");
    });

    it("opens the first changelog and switches to the one picked", async () => {
        docs.changelogs = [
            { path: "/packages/ui/CHANGELOG", title: "UI" },
            { path: "/packages/i18n/CHANGELOG", title: "i18n" },
        ];
        docs.pages = {
            "/packages/ui/CHANGELOG": { title: "UI history" },
            "/packages/i18n/CHANGELOG": { title: "i18n history" },
        };
        serve();
        const wrapper = await mountSuspended(Page, { global });

        expect(wrapper.text()).toContain("UI history");

        await entries(wrapper)[1]!.trigger("click");
        await flushPromises();

        expect(wrapper.text()).toContain("i18n history");
        expect(wrapper.text()).not.toContain("UI history");
    });

    it("names the projects that shipped commits without ever releasing", async () => {
        docs.changelogs = [{ path: "/packages/ui/CHANGELOG", title: "UI" }];
        serve({
            projects: [
                project("packages/ui", { hasChangelog: true, unreleasedCommits: 4 }),
                project("packages/content", { unreleasedCommits: 2 }),
                project("packages/quiet", { unreleasedCommits: 0 }),
            ],
        });
        const wrapper = await mountSuspended(Page, { global });

        expect(alert(wrapper, "Never released")?.props("description")).toBe(
            "Content — commits waiting on a first release, so no changelog yet.",
        );
    });

    it.each([
        [100, "neutral"],
        [75, "warning"],
    ])("reports a %i%% conventional-subject rate in a %s alert", async (rate, color) => {
        docs.changelogs = [{ path: "/packages/ui/CHANGELOG", title: "UI" }];
        serve({ conventionalCommitRate: rate });
        const wrapper = await mountSuspended(Page, { global });

        expect(alert(wrapper, "Conventional subjects")?.props()).toMatchObject({
            color,
            description: `${rate}% of the last 100 commits parse as a version bump.`,
        });
    });
});
