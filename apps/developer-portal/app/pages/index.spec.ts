import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CoverageArtifact } from "#layers/snapshot/shared/types/CoverageArtifact.ts";
import type { DepsArtifact } from "#layers/snapshot/shared/types/DepsArtifact.ts";
import type { DocsArtifact } from "#layers/snapshot/shared/types/DocsArtifact.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import type { ProjectsArtifact } from "#layers/snapshot/shared/types/ProjectsArtifact.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import type { DashboardLayout } from "~/utils/dashboardLayout";
import Page from "./index.vue";
import en from "../../i18n/locales/en.json";

const docs = vi.hoisted(() => ({
    readmes: [] as { path: string; title: string; description: string }[],
}));

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

interface Artifacts {
    projects?: ProjectsArtifact | null;
    coverage?: CoverageArtifact | null;
    metrics?: MetricsArtifact | null;
    deps?: DepsArtifact | null;
    docs?: DocsArtifact | null;
    usage?: UsageArtifact | null;
}

const snapshot = vi.hoisted(() => ({ artifacts: {} as Artifacts }));
mockNuxtImport("projectsArtifact", () => () => snapshot.artifacts.projects ?? null);
mockNuxtImport("coverageArtifact", () => () => snapshot.artifacts.coverage ?? null);
mockNuxtImport("metricsArtifact", () => () => snapshot.artifacts.metrics ?? null);
mockNuxtImport("depsArtifact", () => () => snapshot.artifacts.deps ?? null);
mockNuxtImport("docsArtifact", () => () => snapshot.artifacts.docs ?? null);
mockNuxtImport("usageArtifact", () => () => snapshot.artifacts.usage ?? null);

const app = (name: string): ProjectNode => ({
    name: `@joinery/${name}`,
    root: `apps/${name}`,
    tags: [],
    dependsOn: [],
    dependedOnBy: [],
});

const serve = (artifacts: Artifacts, workflows = assembleWorkflows([], [], {})) => {
    snapshot.artifacts = artifacts;
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
    conventionalCommitRate: null,
    commitsSinceLastRelease: null,
} satisfies MetricsArtifact;

const unreleased = (name: string, commits: number): ProjectMetrics => ({
    name: `@joinery/${name}`,
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
    snapshot.artifacts = {};
    docs.readmes = [];
});

afterEach(() => {
    localStorage.clear();
});

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", en);
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
        await wrapper.findComponent({ name: "UTabs" }).setValue("releases");
        const queue = hrefs(wrapper).filter((href) => href?.startsWith("/projects/"));

        expect(queue).toEqual(["/projects/big", "/projects/small"]);
    });

    it("narrows the queue to one kind of work when its filter is picked", async () => {
        serve({ metrics: { ...METRICS, projects: [unreleased("lib", 3)] } });
        const wrapper = await open();

        await wrapper.findComponent({ name: "UTabs" }).setValue("releases");
        expect(hrefs(wrapper)).toContain("/projects/lib");

        await wrapper.findComponent({ name: "UTabs" }).setValue("decisions");
        expect(hrefs(wrapper)).not.toContain("/projects/lib");
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

    describe("once the welcome and featured widgets are added back", () => {
        beforeEach(() => {
            restore("welcome", "featured");
        });

        it("says the summaries are missing instead of inventing them", async () => {
            serve(projects([app("huella-legal")]));
            const wrapper = await open();

            expect(wrapper.text()).toContain("The repository summary is not available yet.");
            expect(wrapper.text()).toContain("No project description is available yet.");
        });
    });
});
