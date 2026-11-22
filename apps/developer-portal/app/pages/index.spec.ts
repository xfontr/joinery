import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LintRuleUsage } from "#layers/snapshot/shared/types/LintRuleUsage.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import { assembleWorkflows } from "#layers/workflows/shared/workflows.ts";
import Page from "./index.vue";

const artifacts = vi.hoisted(() => ({ usage: null as UsageArtifact | null }));
mockNuxtImport("usageArtifact", () => () => artifacts.usage);

beforeEach(() => {
    artifacts.usage = null;
});

const WORK = [
    {
        path: "/work/huella-legal",
        name: "Huella Legal",
        title: "Huella",
        mark: "Legal",
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

const TEMPLATE = {
    id: "website-rebuild",
    title: "Website rebuild",
    stages: [
        { id: "discovery", title: "Discovery" },
        { id: "build", title: "Build" },
    ],
    capabilities: [
        { id: "audit", stage: "discovery", title: "Content audit" },
        { id: "page", stage: "build", title: "Article page", dependsOn: ["audit"] },
    ],
};

const rule = (enabled: boolean): LintRuleUsage => ({
    enabled,
    hits: 0,
    recent: 0,
    fixable: 0,
    last: null,
    projects: {},
    disabled: 0,
});

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

const open = async ({
    usage = null as UsageArtifact | null,
    projects = [] as { id: string; title: string }[],
} = {}) => {
    artifacts.usage = usage;
    serveEndpoint("/api/workflows", () =>
        assembleWorkflows(
            [{ file: "website-rebuild.yaml", ok: true, value: TEMPLATE }],
            projects.map((project) => ({
                file: `${project.id}.yaml`,
                ok: true,
                value: { ...project, template: "website-rebuild", milestone: project.title },
            })),
            {},
        ),
    );
    const wrapper = await mountSuspended(Page);
    await flushPromises();
    return wrapper;
};

beforeEach(() => {
    docs.benchmarks = [];
    const { $i18n } = useNuxtApp();
    $i18n.mergeLocaleMessage($i18n.locale.value, {
        index: {
            rules: {
                look: { proofCount: "{count} studied" },
                prove: { proofCount: "{enabled} rules, {inHouse} ours" },
            },
        },
    });
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("front page", () => {
    it("states every proof without a number when nothing was ever collected", async () => {
        const wrapper = await open();

        expect(wrapper.findAll("article")).toHaveLength(5 + WORK.length);
        expect(wrapper.text()).toContain("index.rules.look.proof");
        expect(wrapper.text()).toContain("index.rules.prove.proof");
        expect(wrapper.find("[data-workflow-glyph]").exists()).toBe(false);
    });

    it("counts only switched-on lint rules, and the in-house ones among them", async () => {
        const wrapper = await open({ usage: USAGE });

        expect(wrapper.text()).toContain("2 rules, 1 ours");
    });

    it("counts the benchmarked sites from docs/benchmarks", async () => {
        docs.benchmarks = [
            { path: "/docs/benchmarks/rauno-me", title: "rauno.me" },
            { path: "/docs/benchmarks/primer-style", title: "primer.style" },
            { path: "/docs/benchmarks/readme", title: "Benchmarks" },
        ];
        const wrapper = await open();

        expect(wrapper.text()).toContain("2 studied");
    });

    it("sends the reader who wants everything to the developer view", async () => {
        const wrapper = await open();

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toContain("/overview");
        expect(links).not.toContain("/");
    });

    it.each([
        { pointerType: "mouse", previewed: true },
        { pointerType: "touch", previewed: false },
    ])("previews a rule under a $pointerType: $previewed", async ({ pointerType, previewed }) => {
        vi.stubGlobal("matchMedia", (query: string) => ({
            matches: true,
            media: query,
            addEventListener: () => {},
            removeEventListener: () => {},
        }));
        const wrapper = await open();

        await wrapper.find("article").trigger("pointerenter", { pointerType });

        expect(wrapper.find("[data-cursor-preview]").exists()).toBe(previewed);
    });
});
