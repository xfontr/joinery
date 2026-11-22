import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { CoverageArtifact } from "#layers/snapshot/shared/types/CoverageArtifact.ts";
import Page from "./coverage.vue";

const COVERAGE = {
    generatedAt: "2026-11-01T00:00:00Z",
    totals: { lines: 80, statements: 81, functions: 82, branches: 83 },
    report: false,
    projects: [
        {
            name: "tested",
            root: "packages/tested",
            collected: true,
            files: 3,
            lines: { total: 100, covered: 91, pct: 91 },
            statements: { total: 100, covered: 90, pct: 90 },
            functions: { total: 100, covered: 89, pct: 89 },
            branches: { total: 100, covered: 88, pct: 88 },
        },
        { name: "missing", root: "packages/missing", collected: false, files: 0 },
    ],
} satisfies CoverageArtifact;

const artifacts = vi.hoisted(() => ({ coverage: null as CoverageArtifact | null }));
mockNuxtImport("coverageArtifact", () => () => artifacts.coverage);

const serve = (coverage: CoverageArtifact) => {
    artifacts.coverage = coverage;
};

const row = (wrapper: VueWrapper, project: string) =>
    wrapper
        .findAll("tbody tr")
        .find((tr) => tr.find("td").text() === project)!
        .findAll("td")
        .map((td) => td.text());

describe("coverage page", () => {
    it("shows each collected project's four metrics and its file count", async () => {
        serve(COVERAGE);
        const wrapper = await mountSuspended(Page);

        expect(row(wrapper, "tested")).toEqual(["tested", "91%", "90%", "89%", "88%", "3"]);
    });

    // Absent is its own state: a 0% or a blank would read as a measured result
    it("marks a project with no report uncollected instead of giving it a percentage", async () => {
        serve(COVERAGE);
        const wrapper = await mountSuspended(Page);

        expect(row(wrapper, "missing")).toEqual(["missing", "not collected"]);
    });

    it("puts the least covered project first, so the gap leads the table", async () => {
        serve({
            ...COVERAGE,
            projects: [
                COVERAGE.projects[0]!,
                {
                    ...COVERAGE.projects[0]!,
                    name: "thin",
                    root: "packages/thin",
                    lines: { total: 100, covered: 40, pct: 40 },
                },
            ],
        });
        const wrapper = await mountSuspended(Page);

        expect(wrapper.findAll("tbody tr").map((tr) => tr.find("td").text())).toEqual([
            "thin",
            "tested",
        ]);
    });

    it("links each project to the coverage tab of its own page", async () => {
        serve(COVERAGE);
        const wrapper = await mountSuspended(Page);

        expect(wrapper.find("tbody a").attributes("href")).toBe("/projects/tested?tab=coverage");
    });

    it("heads the table with the workspace totals and the summed file count", async () => {
        serve(COVERAGE);
        const wrapper = await mountSuspended(Page);
        const totals = wrapper
            .findAll("thead tr")[1]!
            .findAll("td")
            .map((td) => td.text());

        expect(totals).toEqual(["Workspace", "80%", "81%", "82%", "83%", "3"]);
    });

    it("leaves out the totals when nothing was collected", async () => {
        serve({ ...COVERAGE, totals: null });
        const wrapper = await mountSuspended(Page);

        expect(wrapper.text()).not.toContain("80%");
    });

    it("embeds the copied report and links to it, under the app's base path", async () => {
        serve({ ...COVERAGE, report: true });
        const wrapper = await mountSuspended(Page);

        expect(wrapper.find("iframe").attributes("src")).toContain("/embed/coverage/index.html");
        expect(wrapper.find("a[target=_blank]").attributes("href")).toBe(
            wrapper.find("iframe").attributes("src"),
        );
    });

    it("shows no report frame until the collector has copied one in", async () => {
        serve(COVERAGE);
        const wrapper = await mountSuspended(Page);

        expect(wrapper.find("iframe").exists()).toBe(false);
    });
});
