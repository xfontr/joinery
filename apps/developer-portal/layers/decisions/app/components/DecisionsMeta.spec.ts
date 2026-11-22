import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { DecisionReport } from "#layers/decisions/shared/decisionReports.ts";
import DecisionsMeta from "./DecisionsMeta.vue";

const REPORT = {
    path: "docs/decisions/0009-comment-discipline.md",
    id: "0009-comment-discipline",
    number: "0009",
    title: "Comment discipline",
    status: "to-implement",
    decision: "superseded",
    supersededBy: "0012-later.md",
    updatedAt: null,
    words: 900,
} satisfies DecisionReport;

describe("DecisionsMeta", () => {
    it("links a superseded report to the one that replaced it", async () => {
        const wrapper = await mountSuspended(DecisionsMeta, {
            props: { report: REPORT, source: REPORT.path },
        });

        expect(wrapper.find("a[href='/decisions/0012-later']").exists()).toBe(true);
    });

    it("counts the report's words beside its source path", async () => {
        const wrapper = await mountSuspended(DecisionsMeta, {
            props: { report: REPORT, source: REPORT.path },
        });

        expect(wrapper.text()).toContain("900 words");
        expect(wrapper.text()).toContain(REPORT.path);
    });

    it("shows only the source for a report that isn't collected", async () => {
        const wrapper = await mountSuspended(DecisionsMeta, {
            props: { report: null, source: "docs/decisions/0099-x.md" },
        });

        expect(wrapper.text()).toBe("docs/decisions/0099-x.md");
    });
});
