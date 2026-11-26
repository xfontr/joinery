import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ScriptUsage } from "#layers/snapshot/shared/types/ScriptUsage.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import DailyChart from "~/components/DailyChart.vue";
import PageFacts from "~/components/PageFacts.vue";
import type { PageFact } from "~/types/PageFact";
import Page from "./telemetry.vue";

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
    common: {
        never: "never",
    },
    pageHeader: {
        wordmark: "joinery",
    },
    telemetry: {
        empty: {
            body: "Scripts record each run into {git}, and the next commit carries the rows into {folder}. Commit, then run {command}.",
            title: "No runs committed yet",
        },
        facts: {
            agent: "By agents",
            failed: "Failed",
            neverRun: "Never run",
            runs: "Runs",
            scripts: "Scripts",
        },
        provenance: "Usage log · last {days} days · collected {age}",
        title: "Tooling usage",
    },
    telemetryDaily: {
        endLabel: "last day",
        reading: "{average} {unit} a day on average; the busiest day was {day}, with {peak}.",
        series: {
            runs: {
                title: "Runs per day",
                unit: "runs",
            },
        },
        views: {
            chart: "Chart",
            table: "Table",
        },
    },
};

const artifacts = vi.hoisted(() => ({ usage: null as UsageArtifact | null }));
mockNuxtImport("usageArtifact", () => () => artifacts.usage);

beforeEach(() => {
    artifacts.usage = null;
});

const global = {
    stubs: {
        TelemetryScriptActivity: true,
        TelemetryUsageTriage: true,
        TelemetryLintUsage: true,
    },
};

const tally = (overrides: Partial<ScriptUsage> = {}): ScriptUsage => ({
    runs: 10,
    recent: 10,
    failures: 1,
    headless: 0,
    totalMs: 100,
    first: "2026-11-01",
    last: "2026-11-08",
    callers: { "claude-code": 4, human: 6 },
    commands: {},
    targets: {},
    areas: { content: 6, repo: 4 },
    flags: { check: 3 },
    days: { "2026-11-08": { runs: 10, agent: 4, failures: 1 } },
    ...overrides,
});

const serve = (usage: UsageArtifact | null) => {
    artifacts.usage = usage;
};

const usage = (
    scripts: Record<string, ScriptUsage>,
    known = Object.keys(scripts),
): UsageArtifact => ({
    generatedAt: "2026-11-09T00:00:00.000Z",
    windowDays: 90,
    lint: { since: null, rules: {} },
    known,
    scripts,
});

const facts = (wrapper: VueWrapper) =>
    Object.fromEntries(
        (wrapper.findComponent(PageFacts).props("facts") as PageFact[]).map((fact) => [
            fact.label,
            fact.value,
        ]),
    );

const peak = (wrapper: VueWrapper) =>
    Math.max(...(wrapper.findComponent(DailyChart).props("values") as number[]));

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("telemetry page", () => {
    it("says nothing has been folded yet instead of showing an empty matrix as a result", async () => {
        serve(null);
        const wrapper = await mountSuspended(Page, { global });

        expect(wrapper.text()).toContain("No runs committed yet");
        expect(wrapper.find("table").exists()).toBe(false);
    });

    it("totals the window's runs, agent and failure shares, and counts a script with none as idle", async () => {
        serve(
            usage(
                {
                    drift: tally(),
                    map: tally({
                        runs: 500,
                        days: { "2026-11-08": { runs: 30, agent: 0, failures: 1 } },
                    }),
                },
                ["drift", "map", "ship"],
            ),
        );
        const wrapper = await mountSuspended(Page, { global });

        expect(facts(wrapper)).toEqual({
            Runs: "40",
            "By agents": "10%",
            Failed: "5%",
            Scripts: "3",
            "Never run": "1",
        });
    });

    it("draws the series of the figure picked above the chart", async () => {
        serve(usage({ drift: tally(), map: tally() }));
        const wrapper = await mountSuspended(Page, { global });

        expect(peak(wrapper)).toBe(20);

        const failed = wrapper.findAll("button[aria-pressed]").find((b) => b.text() === "Failed")!;
        await failed.trigger("click");

        expect(failed.attributes("aria-pressed")).toBe("true");
        expect(peak(wrapper)).toBe(2);
    });
});
