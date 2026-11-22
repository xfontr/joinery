import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import type { ProjectsArtifact } from "#layers/snapshot/shared/types/ProjectsArtifact.ts";
import Page from "./index.vue";

const artifacts = vi.hoisted(() => ({
    metrics: null as MetricsArtifact | null,
    projects: null as ProjectsArtifact | null,
}));
mockNuxtImport("metricsArtifact", () => () => artifacts.metrics);
mockNuxtImport("projectsArtifact", () => () => artifacts.projects);

beforeEach(() => {
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

const UI = node("@monorepo/ui", "packages/UI", {
    dependsOn: ["@monorepo/configs"],
    dependedOnBy: ["@monorepo/developer-portal"],
});
const SITE = node("@monorepo/huella-legal", "apps/huella-legal");
const SCRIPTS = node("@monorepo/scripts", "infrastructure/scripts");

const serve = (projects: ProjectNode[], metrics: ProjectMetrics[] = []) => {
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
};

/** Each project row's link and its cells, the group header rows left out. */
const rows = (wrapper: VueWrapper) =>
    wrapper
        .findAll("tbody tr")
        .filter((row) => row.find("td").exists())
        .map((row) => ({
            to: row.find("a").attributes("href"),
            cells: row.findAll("td").map((cell) => cell.text()),
        }));

const groupHeaders = (wrapper: VueWrapper) =>
    wrapper.findAll("th[scope='colgroup']").map((header) => header.text());

beforeEach(() => {
    docs.readmes = [
        { path: "/packages/ui/readme", title: "UI kit", description: "Shared interface pieces." },
    ];
});

describe("catalog page", () => {
    it("groups apps, then packages, then infrastructure, each project linking to its page", async () => {
        serve([UI, SCRIPTS, SITE]);
        const wrapper = await mountSuspended(Page, { route: "/projects" });

        expect(groupHeaders(wrapper)).toEqual(["Apps 1", "Packages 1", "Infrastructure 1"]);
        expect(rows(wrapper).map((row) => row.to)).toEqual([
            "/projects/huella-legal",
            "/projects/UI",
            "/projects/scripts",
        ]);
        expect(rows(wrapper)[1]?.cells[0]).toContain("Shared interface pieces.");
    });

    it("shows only the kind the side menu picked, without group headers", async () => {
        serve([UI, SCRIPTS, SITE]);
        const wrapper = await mountSuspended(Page, { route: "/projects?kind=packages" });

        expect(groupHeaders(wrapper)).toEqual([]);
        expect(rows(wrapper).map((row) => row.to)).toEqual(["/projects/UI"]);
        expect(wrapper.find("h1").text()).toBe("Packages 1");
    });

    it("narrows the table to the projects whose name matches the filter", async () => {
        serve([UI, SCRIPTS, SITE]);
        const wrapper = await mountSuspended(Page, { route: "/projects" });

        await wrapper.find("input").setValue("scr");

        expect(rows(wrapper).map((row) => row.to)).toEqual(["/projects/scripts"]);
        await wrapper.find("input").setValue("nothing-like-it");
        expect(wrapper.text()).toContain("nothing-like-it");
    });

    it("prints each metric with its unit and a dash where nothing was measured", async () => {
        serve(
            [UI],
            [
                metric("@monorepo/ui", {
                    currentVersion: "1.2.0",
                    unreleasedCommits: 4,
                    coverageLinesPct: 91,
                    specs: 3,
                }),
            ],
        );
        const wrapper = await mountSuspended(Page, { route: "/projects" });

        expect(rows(wrapper)[0]?.cells.slice(1)).toEqual(["1.2.0", "+4", "—", "3", "91%", "1"]);
    });

    it("says nothing was collected rather than rendering an empty table", async () => {
        serve([]);
        const wrapper = await mountSuspended(Page, { route: "/projects" });

        expect(rows(wrapper)).toEqual([]);
        expect(wrapper.text()).toContain("No projects collected yet.");
    });
});
