import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Manifest } from "#layers/snapshot/shared/types/Manifest.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import type { ProjectsArtifact } from "#layers/snapshot/shared/types/ProjectsArtifact.ts";
import Page from "./graph.vue";

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
    graph: {
        title: "Project graph",
    },
    graphEdges: {
        lead: "What the picture does not answer: which tags a project carries, and what breaks if it changes.",
        leaf: "leaf",
        title: "Tags and edges",
        usedBy: "used by {list}",
        uses: "uses {list}",
    },
    graphGroups: {
        groups: {
            apps: "Applications",
            packages: "Shared building blocks",
            tooling: "Repository tooling",
        },
        lead: "The repository groups applications, shared building blocks, and the tooling that supports them.",
        noRelations: "No project relationships recorded.",
        none: "No projects in this group.",
        title: "How the pieces fit",
        usedBy: "Used by: {list}",
        uses: "Uses: {list}",
    },
    graphNxEmbed: {
        frame: "Nx project graph",
        lead: "Nx's own graph client, vendored in by the collector rather than redrawn.",
        title: "Detailed Nx graph",
    },
    pageHeader: {
        wordmark: "monorepo",
    },
    snapshotAge: {
        at: "At {commit} on {branch}",
        collected: "Collected {age}",
    },
};

const artifacts = vi.hoisted(() => ({
    manifest: null as Manifest | null,
    metrics: null as MetricsArtifact | null,
    projects: null as ProjectsArtifact | null,
}));
mockNuxtImport("snapshotManifest", () => () => artifacts.manifest);
mockNuxtImport("metricsArtifact", () => () => artifacts.metrics);
mockNuxtImport("projectsArtifact", () => () => artifacts.projects);

beforeEach(() => {
    artifacts.manifest = null;
    artifacts.metrics = null;
    artifacts.projects = null;
});

const MANIFEST = {
    schemaVersion: 1,
    generatedAt: "2026-11-01T00:00:00Z",
    commit: "abc",
    branch: "master",
    artifacts: {},
} satisfies Manifest;

const node = (root: string, links: Partial<ProjectNode> = {}): ProjectNode => ({
    name: root.split("/").pop()!,
    root,
    tags: [],
    dependsOn: [],
    dependedOnBy: [],
    ...links,
});

const METRICS = {
    generatedAt: "2026-11-01T00:00:00Z",
    commit: "abc",
    branch: "master",
    projects: [],
    invariantFindings: [],
    conventionalCommitRate: null,
    commitsSinceLastRelease: null,
} satisfies MetricsArtifact;

const serve = (projects: ProjectNode[], metrics: MetricsArtifact = METRICS) => {
    artifacts.manifest = MANIFEST;
    artifacts.projects = { generatedAt: "2026-11-01T00:00:00Z", projects, retired: [] };
    artifacts.metrics = metrics;
};

const group = (wrapper: VueWrapper, heading: string) =>
    wrapper
        .findAll("h3")
        .find((h3) => h3.text() === heading)!
        .element.closest("[data-slot=root]")!;

const listed = (wrapper: VueWrapper, heading: string) =>
    [...group(wrapper, heading).querySelectorAll("p.font-medium")].map((p) =>
        p.textContent?.trim(),
    );

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("graph page", () => {
    it("files each project under apps, packages or tooling by where it lives", async () => {
        serve([
            node("apps/site"),
            node("packages/ui"),
            node("infrastructure/scripts"),
            node("apps/blog"),
        ]);
        const wrapper = await mountSuspended(Page);

        expect(listed(wrapper, "Applications")).toEqual(["site", "blog"]);
        expect(listed(wrapper, "Shared building blocks")).toEqual(["ui"]);
        expect(listed(wrapper, "Repository tooling")).toEqual(["scripts"]);
    });

    it("lists what a project uses and what uses it", async () => {
        serve([
            node("apps/site", { dependsOn: ["ui", "content"] }),
            node("packages/ui", { dependedOnBy: ["site"] }),
        ]);
        const wrapper = await mountSuspended(Page);

        expect(group(wrapper, "Applications").textContent).toContain("Uses: ui, content");
        expect(group(wrapper, "Shared building blocks").textContent).toContain("Used by: site");
    });

    it("says a group is empty instead of leaving a blank card", async () => {
        serve([node("apps/site")]);
        const wrapper = await mountSuspended(Page);

        expect(group(wrapper, "Shared building blocks").textContent).toContain(
            "No projects in this group.",
        );
        expect(group(wrapper, "Applications").textContent).not.toContain(
            "No projects in this group.",
        );
    });

    it("embeds the Nx graph under the app's base path", async () => {
        serve([]);
        const wrapper = await mountSuspended(Page);

        expect(wrapper.find("iframe").attributes("src")).toContain("/embed/graph/index.html");
    });

    it("dates the page by the projects snapshot and surfaces invariant findings", async () => {
        serve([], {
            ...METRICS,
            invariantFindings: [{ id: "x", title: "Drift", detail: "Fix it", evidence: [] }],
        });
        const wrapper = await mountSuspended(Page);

        expect(wrapper.find("[title='At abc on master']").exists()).toBe(true);
        expect(wrapper.text()).toContain("Drift");
    });
});
