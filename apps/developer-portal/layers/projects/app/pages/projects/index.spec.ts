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
import Page from "./index.vue";

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

const rows = (wrapper: VueWrapper) =>
    wrapper.findAll("li > *").map((row) => ({
        to: row.attributes("href"),
        text: row.text(),
        figures: Object.fromEntries(
            row
                .findAll("dl > div")
                .map((figure) => [figure.find("dt").text(), figure.find("dd").text()]),
        ),
    }));

beforeEach(() => {
    docs.readmes = [
        { path: "/packages/ui/readme", title: "UI kit", description: "Shared interface pieces." },
    ];
    github.deployments = [];
    github.error = null;
});

describe("catalog page", () => {
    it("orders applications, then tooling, then packages, each linking to its own page", async () => {
        serve([UI, SCRIPTS, SITE]);
        const wrapper = await mountSuspended(Page);

        expect(rows(wrapper).map((row) => row.to)).toEqual([
            "/projects/huella-legal",
            "/projects/scripts",
            "/projects/UI",
        ]);
        expect(rows(wrapper)[2]?.text).toContain("Shared interface pieces.");
    });

    it("pairs each metric with its unit and shows a dash where nothing was measured", async () => {
        serve([UI, SCRIPTS], {
            metrics: [metric("@monorepo/ui", { commits: 4, specs: 2, coverageLinesPct: 90 })],
        });
        const wrapper = await mountSuspended(Page);
        const [scripts, ui] = rows(wrapper);

        expect(ui?.figures).toEqual({ coverage: "90%", specs: "2", commits: "4" });
        expect(scripts?.figures).toEqual({ coverage: "—", specs: "—", commits: "—" });
    });

    it("lists a deleted project after every live one, linking its commit", async () => {
        serve([node("@monorepo/zeta", "packages/zeta")], {
            retired: [
                {
                    name: "@monorepo/old",
                    root: "packages/old",
                    tags: [],
                    deletedAt: "2026-11-08",
                    commit: "abc123",
                    subject: "chore: delete the old package",
                    commits: 12,
                },
            ],
        });
        useRuntimeConfig().public.repoUrl = "https://github.com/acme/repo";
        const wrapper = await mountSuspended(Page);
        useRuntimeConfig().public.repoUrl = "";
        const [, retired] = rows(wrapper);

        expect(retired?.to).toBe("https://github.com/acme/repo/commit/abc123");
        expect(retired?.text).toContain("Deleted 2026-11-08 · chore: delete the old package");
        expect(retired?.figures.commits).toBe("12");
    });

    it("leaves a deleted project unlinked when no repository is configured, rather than linking a dead path", async () => {
        serve([], {
            retired: [
                {
                    name: "@monorepo/old",
                    root: "packages/old",
                    tags: [],
                    deletedAt: "2026-11-08",
                    commit: "abc123",
                    subject: "chore: delete the old package",
                    commits: 12,
                },
            ],
        });
        const wrapper = await mountSuspended(Page);

        expect(rows(wrapper)[0]?.to).toBeUndefined();
    });

    it("lists no rows when nothing was collected", async () => {
        serve([]);
        const wrapper = await mountSuspended(Page);

        expect(rows(wrapper)).toHaveLength(0);
    });
});
