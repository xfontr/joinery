import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DepsArtifact } from "#layers/snapshot/shared/types/DepsArtifact.ts";
import Page from "./deps.vue";

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
        severity: {
            critical: "critical",
            high: "high",
            low: "low",
            moderate: "moderate",
        },
    },
    deps: {
        facts: {
            dependencies: "Dependencies",
            outdated: "Outdated",
        },
        provenance: "pnpm audit and pnpm outdated · collected {age}",
        title: "Dependencies",
    },
    healthAdvisories: {
        columns: {
            advisory: "Advisory",
            package: "Package",
            patched: "Patched",
            severity: "Severity",
            via: "Pulled in via",
        },
        meta: "Every finding pnpm audit reports, over the whole workspace lockfile",
        none: "No known vulnerabilities.",
        notCollected: "Not collected.",
        title: "Advisories",
    },
    healthOutdated: {
        columns: {
            current: "Current",
            latest: "Latest",
            package: "Package",
            projects: "Projects",
            usedBy: "Used by",
            wanted: "Wanted",
        },
        deprecated: "deprecated",
        meta: "pnpm outdated -r · wanted is what the range in package.json already allows",
        notCollected: "Not collected.",
        title: "Outdated",
        upToDate: "Everything is on its wanted version.",
    },
    pageHeader: {
        wordmark: "joinery",
    },
};

const artifacts = vi.hoisted(() => ({ deps: null as DepsArtifact | null }));
mockNuxtImport("depsArtifact", () => () => artifacts.deps);

beforeEach(() => {
    artifacts.deps = null;
});

const NONE = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };

const DEPS = {
    generatedAt: "2026-11-01T00:00:00Z",
    vulnerabilities: { info: 0, low: 1, moderate: 2, high: 3, critical: 4 },
    totalDependencies: 99,
    advisories: [
        {
            id: 1,
            moduleName: "vue",
            severity: "high",
            title: "Security issue",
            patchedVersions: ">=3",
            url: "https://example.test/advisory",
            paths: ["app > vue"],
        },
    ],
    outdated: [
        {
            name: "nuxt",
            current: "4.0.0",
            wanted: "4.0.1",
            latest: "4.1.0",
            isDeprecated: false,
            dependents: ["apps/site", "apps/blog"],
        },
    ],
} satisfies DepsArtifact;

const UNCOLLECTED = {
    ...DEPS,
    vulnerabilities: null,
    totalDependencies: null,
    advisories: [],
    outdated: null,
} satisfies DepsArtifact;

const serve = (deps: DepsArtifact) => {
    artifacts.deps = deps;
};

const cells = (wrapper: VueWrapper, name: string) =>
    wrapper
        .findAll("tbody tr")
        .find((tr) => tr.findAll("td").some((td) => td.text().startsWith(name)))!
        .findAll("td")
        .map((td) => td.text());

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("dependencies page", () => {
    it("lists each advisory with its module, severity, fix and the chain that pulls it in", async () => {
        serve(DEPS);
        const wrapper = await mountSuspended(Page);

        expect(cells(wrapper, "vue")).toEqual([
            "high",
            expect.stringContaining("vue"),
            "Security issue",
            ">=3",
            "app > vue",
        ]);
        expect(wrapper.find("a[href='https://example.test/advisory']").exists()).toBe(true);
    });

    it("lists each outdated package's three versions and every project using it", async () => {
        serve(DEPS);
        const wrapper = await mountSuspended(Page);

        expect(cells(wrapper, "nuxt")).toEqual([
            "nuxt",
            "4.0.0",
            "4.0.1",
            "4.1.0",
            "2",
            "apps/site, apps/blog",
        ]);
    });

    it("flags a deprecated package beside its name", async () => {
        serve({ ...DEPS, outdated: [{ ...DEPS.outdated[0]!, isDeprecated: true }] });
        const wrapper = await mountSuspended(Page);

        expect(cells(wrapper, "nuxt")[0]).toContain("deprecated");
    });

    it("says an audit that never ran was not collected, never that nothing was found", async () => {
        serve(UNCOLLECTED);
        const wrapper = await mountSuspended(Page);

        expect(wrapper.text()).toContain("Not collected.");
        expect(wrapper.text()).not.toContain("No known vulnerabilities.");
        expect(wrapper.text()).not.toContain("Everything is on its wanted version.");
    });

    it("says a clean audit found nothing, never that it was not collected", async () => {
        serve({ ...DEPS, vulnerabilities: NONE, advisories: [], outdated: [] });
        const wrapper = await mountSuspended(Page);

        expect(wrapper.text()).toContain("No known vulnerabilities.");
        expect(wrapper.text()).toContain("Everything is on its wanted version.");
        expect(wrapper.text()).not.toContain("Not collected.");
    });
});
