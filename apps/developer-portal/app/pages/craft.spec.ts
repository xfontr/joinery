import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { LintRuleUsage } from "#layers/snapshot/shared/types/LintRuleUsage.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { ProjectMetrics } from "#layers/snapshot/shared/types/ProjectMetrics.ts";
import type { SnapshotResponse } from "#layers/snapshot/shared/types/SnapshotResponse.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import Page from "./craft.vue";

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
    serveEndpoint("/api/snapshot/metrics", (): SnapshotResponse => ({
        manifest: null,
        metrics: snapshot.metrics ?? null,
    }));
    serveEndpoint("/api/snapshot/usage", (): SnapshotResponse => ({
        manifest: null,
        usage: snapshot.usage ?? null,
    }));
    return mountSuspended(Page);
};

describe("craft page", () => {
    it("states every claim without a number when nothing was ever collected", async () => {
        const wrapper = await open();

        expect(wrapper.findAll("article")).toHaveLength(8);
        expect(wrapper.text()).toContain("Tests from one function to a whole page");
        expect(wrapper.text()).toContain("Lint rules decide what lands");
    });

    it("counts test files across every project in the snapshot", async () => {
        const wrapper = await open({ metrics: METRICS });

        expect(wrapper.text()).toContain("42 test files");
    });

    it("counts only switched-on lint rules, and the in-house ones among them", async () => {
        const wrapper = await open({ usage: USAGE });

        expect(wrapper.text()).toContain("2 lint rules switched on, 1 of them written in-house.");
    });
});
