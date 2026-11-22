import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LintRuleUsage } from "#layers/snapshot/shared/types/LintRuleUsage.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import { ruleCounts } from "#layers/telemetry/shared/lintUsage.ts";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import type { DocsArtifact } from "#layers/snapshot/shared/types/DocsArtifact.ts";
import Page from "./method.vue";

const artifacts = vi.hoisted(() => ({
    docs: null as DocsArtifact | null,
    metrics: null as MetricsArtifact | null,
}));
mockNuxtImport("docsArtifact", () => () => artifacts.docs);
mockNuxtImport("metricsArtifact", () => () => artifacts.metrics);

beforeEach(() => {
    artifacts.docs = null;
    artifacts.metrics = null;
});

const WORK = [
    {
        path: "/work/huella-legal",
        name: "Huella Legal",
        title: "Huella",
        mark: "Legal",
        facts: ["105 articles"],
        screenshot: { file: "huella-legal.jpg", alt: "Home", caption: "Home." },
        kind: "Law magazine",
        stage: "Redesign on staging",
        line: "A law magazine.",
        caseStudy: true,
        live: { href: "https://staging.example.com", label: "See the new site" },
    },
    {
        path: "/work/portal",
        name: "This portal",
        kind: "Developer portal",
        stage: "Mid-redesign",
        line: "The site you're reading.",
        caseStudy: false,
        live: { href: "/overview", label: "Open the developer view" },
    },
];

const docs = vi.hoisted(() => ({ benchmarks: [] as { path: string; title: string }[] }));

mockNuxtImport("queryCollection", () => (collection: string) => {
    const rows = collection === "work" ? WORK : docs.benchmarks;
    const query = {
        where: () => query,
        select: () => query,
        order: () => query,
        all: () => Promise.resolve(rows),
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
    serveEndpoint("/api/telemetry/rules", () => ruleCounts(snapshot.usage?.lint));
    artifacts.metrics = snapshot.metrics ?? null;
    const wrapper = await mountSuspended(Page);
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    docs.benchmarks = [];
    const { $i18n } = useNuxtApp();
    $i18n.mergeLocaleMessage($i18n.locale.value, {
        rules: { look: { count: "{count} studied" }, plan: { count: "{count} lessons" } },
        method: {
            prove: {
                checks: {
                    lint: { claimCount: "{enabled} rules, {inHouse} ours" },
                    tests: { claimCount: "{count} specs" },
                },
            },
        },
    });
});

describe("method page", () => {
    it("counts and names the benchmarked sites, leaving out the folder's README", async () => {
        docs.benchmarks = [
            { path: "/docs/benchmarks/rauno-me", title: "rauno.me" },
            { path: "/docs/benchmarks/primer-style", title: "primer.style" },
            { path: "/docs/benchmarks/readme", title: "Benchmarks" },
        ];
        const wrapper = await open();

        expect(wrapper.get("#look").text()).toContain("2 studied");
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

        expect(wrapper.get("#plan").text()).toContain("3 lessons");
    });

    it("counts test files across every project in the snapshot", async () => {
        const wrapper = await open({ metrics: METRICS });

        expect(wrapper.get("#prove").text()).toContain("42 specs");
    });

    it("counts only switched-on lint rules, and the in-house ones among them", async () => {
        const wrapper = await open({ usage: USAGE });

        expect(wrapper.get("#prove").text()).toContain("2 rules, 1 ours");
    });

    it("states every rule without a number when nothing was ever collected", async () => {
        const wrapper = await open();

        expect(wrapper.text()).not.toContain("studied");
        expect(wrapper.text()).not.toContain("specs");
        expect(wrapper.text()).toContain("method.prove.checks.lint.claim");
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
