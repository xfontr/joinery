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
import Page from "./projects.vue";

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
    const query = { select: () => query, all: () => Promise.resolve(docs.readmes) };
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

type Wrapper = VueWrapper;

const cards = (wrapper: Wrapper) =>
    wrapper.findAll("h2").map((h2) => ({
        title: h2.text(),
        element: h2.element.closest("[data-slot=root]") as HTMLElement,
    }));

const card = (wrapper: Wrapper, title: string) =>
    cards(wrapper).find((found) => found.title === title)!.element;

const squash = (text: string | null | undefined) => (text ?? "").replace(/\s+/g, " ").trim();

/** The value printed under a metric's label, such as "Commits". */
const metricIn = (element: HTMLElement, label: string) =>
    squash(
        [...element.querySelectorAll("p")].find((p) => squash(p.textContent) === label)
            ?.nextElementSibling?.textContent,
    );

/** The relationship line that starts with `prefix`, such as "Uses:". */
const lineIn = (element: HTMLElement, prefix: string) =>
    [...element.querySelectorAll("div")]
        .filter((div) => div.querySelector("div") === null)
        .map((div) => squash(div.textContent))
        .find((text) => text.startsWith(prefix));

beforeEach(() => {
    docs.readmes = [
        { path: "/packages/ui/readme", title: "UI kit", description: "Shared interface pieces." },
    ];
    github.deployments = [];
    github.error = null;
});

describe("projects page", () => {
    it("orders applications, then tooling, then packages, each titled by its README", async () => {
        serve([UI, SCRIPTS, SITE]);
        const wrapper = await mountSuspended(Page);

        expect(cards(wrapper).map(({ title }) => title)).toEqual([
            "@monorepo/huella-legal",
            "@monorepo/scripts",
            "UI kit",
        ]);
        expect(
            card(wrapper, "UI kit").querySelector("a[href='/docs/packages/ui/readme']"),
        ).not.toBeNull();
    });

    it("pairs each metric with its unit and shows a dash where nothing was measured", async () => {
        serve([UI, SCRIPTS], {
            metrics: [
                metric("@monorepo/ui", {
                    commits: 4,
                    commitsLastTwoWeeks: 1,
                    specs: 2,
                    coverageLinesPct: 90,
                }),
            ],
        });
        const wrapper = await mountSuspended(Page);
        const measured = card(wrapper, "UI kit");
        const unmeasured = card(wrapper, "@monorepo/scripts");

        expect(metricIn(measured, "Commits")).toBe("4 (1 last two weeks)");
        expect(metricIn(measured, "Tests")).toBe("2 (90% coverage)");
        expect(metricIn(unmeasured, "Commits")).toBe("—");
        expect(metricIn(unmeasured, "Tests")).toBe("—");
    });

    it("lists what a project uses and what uses it, and says so when it is isolated", async () => {
        serve([UI, SCRIPTS]);
        const wrapper = await mountSuspended(Page);

        const ui = card(wrapper, "UI kit");

        expect(lineIn(ui, "Uses:")).toBe("Uses: @monorepo/configs");
        expect(lineIn(ui, "Used by:")).toBe("Used by: @monorepo/developer-portal");
        expect(card(wrapper, "@monorepo/scripts").textContent).toContain(
            "No project relationships recorded.",
        );
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
        serve([SITE, SCRIPTS]);
        const wrapper = await mountSuspended(Page);
        const site = card(wrapper, "@monorepo/huella-legal");
        const hrefs = [...site.querySelectorAll("a")].map((a) => a.getAttribute("href"));

        expect(hrefs).toEqual(
            expect.arrayContaining([
                "https://site.example",
                "https://site.example/_scalar",
                expect.stringMatching(/\/huella-legal-storybook\/$/),
                expect.stringMatching(/\/actions\/workflows\/netlify-deployment\.yml$/),
            ]),
        );
        expect(card(wrapper, "@monorepo/scripts").querySelector("a[href$='/_scalar']")).toBeNull();
    });

    it("drops the live links and says why when GitHub cannot be read", async () => {
        github.error = "GitHub unavailable";
        serve([SITE]);
        const wrapper = await mountSuspended(Page);

        expect(wrapper.text()).toContain("Live deployment status is unavailable");
        expect(wrapper.find("a[href$='/_scalar']").exists()).toBe(false);
    });

    it("lists a deleted project after every live one, linking its commit instead of dead docs", async () => {
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
        const retired = card(wrapper, "@monorepo/old");

        expect(cards(wrapper).map(({ title }) => title)).toEqual([
            "@monorepo/zeta",
            "@monorepo/old",
        ]);
        expect(retired.textContent).toContain("Deleted 2026-11-08 · chore: delete the old package");
        expect(retired.querySelector("[aria-label='Commits']")?.textContent?.trim()).toBe("12");
        expect(retired.querySelector("a[href$='/commit/abc123']")).not.toBeNull();
        expect(retired.querySelector("a[href='/docs/packages/old/readme']")).toBeNull();
    });

    it("renders no cards when nothing was collected", async () => {
        serve([]);
        const wrapper = await mountSuspended(Page);

        expect(cards(wrapper)).toHaveLength(0);
    });
});
