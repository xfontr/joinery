import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import type { ProjectCoverage } from "#layers/snapshot/shared/types/ProjectCoverage.ts";
import CoverageTab from "./CoverageTab.vue";

const MESSAGES = {
    common: {
        metrics: {
            branches: "branches",
            lines: "lines",
        },
    },
    projectCoverageTab: {
        empty: "No usable coverage report for this project.",
        meta: "Vitest · {files} files · collected {age}",
        notCollected: "Not collected",
        parts: {
            covered: "covered",
            uncovered: "not covered",
        },
        title: "Coverage",
    },
};

const COVERAGE = {
    name: "@monorepo/ui",
    root: "packages/ui",
    collected: true,
    files: 14,
    lines: { total: 200, covered: 180, pct: 90 },
    branches: { total: 40, covered: 20, pct: 50 },
} satisfies ProjectCoverage;

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("ProjectCoverageTab", () => {
    it("shows only the metrics the report has, each with its percentage", async () => {
        const wrapper = await mountSuspended(CoverageTab, {
            props: { coverage: COVERAGE, age: "2 days ago" },
        });

        expect(wrapper.findAll("dt").map((label) => label.text())).toEqual(["lines", "branches"]);
        expect(wrapper.findAll("dd").map((figure) => figure.text())).toEqual(["90%", "50%"]);
    });

    it("says there is no report for a project nothing collected", async () => {
        const wrapper = await mountSuspended(CoverageTab, {
            props: { coverage: undefined, age: "never" },
        });

        expect(wrapper.find("dl").exists()).toBe(false);
        expect(wrapper.text()).toContain("Not collected");
    });
});
