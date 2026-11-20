import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LintRuleUsage } from "#layers/snapshot/shared/types/LintRuleUsage.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { SnapshotResponse } from "#layers/snapshot/shared/types/SnapshotResponse.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Page from "./method.vue";

const docs = vi.hoisted(() => ({ benchmarks: [] as { path: string; title: string }[] }));

mockNuxtImport("queryCollection", () => () => {
    const query = {
        where: () => query,
        select: () => query,
        all: () => Promise.resolve(docs.benchmarks),
    };
    return query;
});

const REBUILD = {
    id: "website-rebuild",
    title: "Website rebuild",
    summary: "An existing site rebuilt without losing an address.",
    stages: [{ id: "discovery", title: "Discovery", goal: "Know what the old site holds." }],
    capabilities: [
        {
            id: "url-inventory",
            stage: "discovery",
            title: "URL inventory",
            lessons: [
                { text: "Renamed URLs were redirected late.", issues: [1] },
                { text: "Hidden pages were found after launch.", issues: [2] },
            ],
        },
    ],
    types: [
        {
            id: "page",
            stage: "discovery",
            title: "Page",
            lessons: [{ text: "A page was missed.", issues: [3] }],
        },
    ],
};

const CUSTOM = { id: "custom", title: "Custom", summary: "Start empty.", stages: [] };

const project = (root: string, specs: number): ProjectMetrics => ({
    name: root,
    root,
    specs,
    commits: null,
    commitsLastTwoWeeks: null,
    coverageLinesPct: null,
    unreleasedCommits: null,
    currentVersion: null,
    hasChangelog: false,
});

const rule = (enabled: boolean): LintRuleUsage => ({
    enabled,
    hits: 0,
    recent: 0,
    fixable: 0,
    last: null,
    projects: {},
    disabled: 0,
});

const METRICS: MetricsArtifact = {
    generatedAt: "2026-11-01T00:00:00Z",
    commit: "abc",
    branch: "master",
    projects: [project("apps/blog", 12), project("packages/content", 30)],
    invariantFindings: [],
    conventionalCommitRate: null,
    commitsSinceLastRelease: null,
};

const USAGE: UsageArtifact = {
    generatedAt: "2026-11-01T00:00:00Z",
    windowDays: 30,
    known: [],
    scripts: {},
    lint: {
        since: null,
        rules: {
            "no-console": rule(true),
            "monorepo/no-build-step": rule(true),
            "monorepo/retired": rule(false),
        },
    },
};

const open = async (snapshot: { metrics?: MetricsArtifact; usage?: UsageArtifact } = {}) => {
    serveEndpoint("/api/workflows", () =>
        assembleWorkflows(
            [
                { file: "website-rebuild.yaml", ok: true, value: REBUILD },
                { file: "custom.yaml", ok: true, value: CUSTOM },
            ],
            [],
            {},
        ),
    );
    serveEndpoint("/api/snapshot/docs", (): SnapshotResponse => ({ manifest: null, docs: null }));
    serveEndpoint("/api/snapshot/metrics", (): SnapshotResponse => ({
        manifest: null,
        metrics: snapshot.metrics ?? null,
    }));
    serveEndpoint("/api/snapshot/usage", (): SnapshotResponse => ({
        manifest: null,
        usage: snapshot.usage ?? null,
    }));
    const wrapper = await mountSuspended(Page);
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    docs.benchmarks = [];
});

describe("method page", () => {
    it("counts and names the benchmarked sites, leaving out the folder's README", async () => {
        docs.benchmarks = [
            { path: "/docs/benchmarks/rauno-me", title: "rauno.me" },
            { path: "/docs/benchmarks/primer-style", title: "primer.style" },
            { path: "/docs/benchmarks/readme", title: "Benchmarks" },
        ];
        const wrapper = await open();

        expect(wrapper.get("#look").text()).toContain("2 sites studied so far.");
        expect(wrapper.get("#look").text()).toContain("primer.style · rauno.me");
    });

    it("lists only templates that hold blocks, so the empty custom one isn't offered", async () => {
        const wrapper = await open();

        const plan = wrapper.get("#plan");
        expect(plan.text()).toContain("Website rebuild");
        expect(plan.text()).not.toContain("Custom");
    });

    it("counts the lessons on a template's repeatable blocks as well as its fixed ones", async () => {
        const wrapper = await open();

        expect(wrapper.get("#plan").text()).toContain("3 lessons from past projects");
    });

    it("counts test files across every project in the snapshot", async () => {
        const wrapper = await open({ metrics: METRICS });

        expect(wrapper.get("#prove").text()).toContain("42 test files");
    });

    it("counts only switched-on lint rules, and the in-house ones among them", async () => {
        const wrapper = await open({ usage: USAGE });

        expect(wrapper.get("#prove").text()).toContain(
            "2 lint rules on, 1 of them written for this repo.",
        );
    });

    it("states every rule without a number when nothing was ever collected", async () => {
        const wrapper = await open();

        expect(wrapper.text()).not.toContain("sites studied so far");
        expect(wrapper.text()).not.toContain("test files");
        expect(wrapper.text()).toContain("Lint rules, some written for this repo.");
    });

    it("links each written-down decision to its developer page", async () => {
        const wrapper = await open();

        const links = wrapper.findAll("#decide a").map((link) => link.attributes("href"));
        expect(links).toEqual(
            expect.arrayContaining([
                "/decisions/0009-comment-discipline",
                "/decisions/0040-developer-portal-visitor-structure",
            ]),
        );
    });

    it("ends on a real case, so the rules can be seen applied", async () => {
        const wrapper = await open();

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toContain("/work/huella-legal");
    });
});
