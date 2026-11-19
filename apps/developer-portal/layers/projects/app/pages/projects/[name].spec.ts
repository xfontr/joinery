import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { ref } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { EnvironmentDeployment } from "#layers/github/shared/deployments.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import type { RetiredProject } from "#layers/snapshot/shared/types/RetiredProject.ts";
import type { SnapshotResponse } from "#layers/snapshot/shared/types/SnapshotResponse.ts";
import Page from "./[name].vue";

// An in-memory docs collection, answering the README query the page sends
const docs = vi.hoisted(() => ({
    readmes: [] as { path: string; title: string; description: string }[],
}));

// GitHub's API is read straight from the browser, so the github layer's composable is the boundary
const github = vi.hoisted(() => ({
    deployments: [] as EnvironmentDeployment[],
    error: null as string | null,
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

mockNuxtImport("useDeployments", () => () => ({
    data: ref({ deployments: github.deployments, error: github.error }),
}));

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

const serve = (
    projects: ProjectNode[],
    { metrics = [], retired = [] }: { metrics?: ProjectMetrics[]; retired?: RetiredProject[] } = {},
) => {
    const metricsArtifact = {
        generatedAt: "2026-11-01T00:00:00Z",
        commit: "abc",
        branch: "master",
        projects: metrics,
        invariantFindings: [],
        conventionalCommitRate: null,
        commitsSinceLastRelease: null,
    } satisfies MetricsArtifact;

    serveEndpoint("/api/snapshot/projects", (): SnapshotResponse => ({
        manifest: null,
        projects: { generatedAt: "2026-11-01T00:00:00Z", projects, retired },
    }));
    serveEndpoint("/api/snapshot/metrics", (): SnapshotResponse => ({
        manifest: null,
        metrics: metricsArtifact,
    }));
};

/** Each fact by its label, the count beside a list label left out. */
const facts = (wrapper: VueWrapper) =>
    Object.fromEntries(
        wrapper
            .findAll("dl > div")
            .map((fact) => [
                fact.find("dt").element.firstChild?.textContent?.trim(),
                fact.findAll("dd").map((dd) => dd.text()),
            ]),
    );

const hrefs = (wrapper: VueWrapper) => wrapper.findAll("a").map((a) => a.attributes("href"));

beforeEach(() => {
    docs.readmes = [];
    github.deployments = [];
    github.error = null;
});

describe("project page", () => {
    it("links what a project uses and what uses it to their own pages", async () => {
        serve([UI, node("@monorepo/configs", "packages/configs"), SCRIPTS]);
        const wrapper = await mountSuspended(Page, { route: "/projects/UI" });

        expect(facts(wrapper)["Uses"]).toEqual(["@monorepo/configs"]);
        expect(facts(wrapper)["Used by"]).toEqual(["@monorepo/developer-portal"]);
        expect(hrefs(wrapper)).toContain("/projects/configs");
    });

    it("prints each metric with its unit and a dash where nothing was measured", async () => {
        serve([UI], { metrics: [metric("@monorepo/ui", { coverageLinesPct: 90, specs: 2 })] });
        const wrapper = await mountSuspended(Page, { route: "/projects/UI" });

        expect(facts(wrapper)["Line coverage"]).toEqual(["90%"]);
        expect(facts(wrapper)["Specs"]).toEqual(["2"]);
        expect(facts(wrapper)["Commits"]).toEqual(["—"]);
    });

    it("links a deployed app to its live site, API docs, Storybook and deploys", async () => {
        github.deployments = [
            {
                environment: "huella-legal",
                state: "success",
                url: "https://site.example",
                updatedAt: "2026-09-20",
            },
        ];
        serve([SITE]);
        const wrapper = await mountSuspended(Page, { route: "/projects/huella-legal" });

        expect(hrefs(wrapper)).toEqual(
            expect.arrayContaining([
                "https://site.example",
                "https://site.example/_scalar",
                expect.stringMatching(/\/huella-legal-storybook\/$/),
                expect.stringMatching(/\/actions\/workflows\/netlify-deployment\.yml$/),
                "/wiki/apps/huella-legal/readme",
            ]),
        );
    });

    it("drops the live links and says why when GitHub cannot be read", async () => {
        github.error = "GitHub unavailable";
        serve([SITE]);
        const wrapper = await mountSuspended(Page, { route: "/projects/huella-legal" });

        expect(wrapper.text()).toContain("GitHub unavailable");
        expect(wrapper.find("a[href$='/_scalar']").exists()).toBe(false);
    });

    it("names the folder it could not find instead of rendering an empty project", async () => {
        serve([UI]);
        const wrapper = await mountSuspended(Page, { route: "/projects/nowhere" });

        expect(wrapper.text()).toContain("nowhere");
        expect(wrapper.find("dl").exists()).toBe(false);
    });
});
