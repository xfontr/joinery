import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { ProjectCoverage } from "#layers/snapshot/shared/types/ProjectCoverage.ts";
import HealthCoverageTable from "./HealthCoverageTable.vue";

const metric = (pct: number) => ({ total: 100, covered: pct, pct });

const project = (name: string, lines: number | null): ProjectCoverage => ({
    name,
    root: `packages/${name}`,
    collected: lines !== null,
    files: 3,
    ...(lines !== null && {
        lines: metric(lines),
        statements: metric(lines),
        functions: metric(lines),
        branches: metric(lines),
    }),
});

describe("HealthCoverageTable", () => {
    it("puts the least covered project first and an uncollected one last", async () => {
        const wrapper = await mountSuspended(HealthCoverageTable, {
            props: {
                projects: [project("ok", 90), project("none", null), project("weak", 40)],
                totals: null,
            },
        });

        expect(wrapper.findAll("tbody a").map((link) => link.text())).toEqual([
            "weak",
            "ok",
            "none",
        ]);
    });

    it("marks a project with no report uncollected rather than 0%", async () => {
        const wrapper = await mountSuspended(HealthCoverageTable, {
            props: { projects: [project("none", null)], totals: null },
        });

        expect(wrapper.find("tbody").text()).not.toContain("0%");
    });

    it("sums the files across projects in the workspace row", async () => {
        const wrapper = await mountSuspended(HealthCoverageTable, {
            props: {
                projects: [project("a", 90), project("b", 80)],
                totals: { lines: 85, statements: 85, functions: 85, branches: 85 },
            },
        });

        expect(wrapper.find("thead tr:last-child").text()).toMatch(/85%.*6$/s);
    });
});
