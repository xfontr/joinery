import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { DecisionReport } from "#layers/decisions/shared/decisionReports.ts";
import DecisionsRow from "./DecisionsRow.vue";

const REPORT = {
    path: "docs/decisions/0009-comment-discipline.md",
    id: "0009-comment-discipline",
    number: "0009",
    title: "Comment discipline",
    status: "implemented",
    decision: "accepted",
    supersededBy: null,
    updatedAt: null,
    words: 900,
} satisfies DecisionReport;

describe("DecisionsRow", () => {
    it("links to the report by number and shows its status", async () => {
        const wrapper = await mountSuspended(DecisionsRow, { props: { report: REPORT } });

        expect(wrapper.find("a").attributes("href")).toBe("/decisions/0009-comment-discipline");
        expect(wrapper.text()).toContain("0009");
        expect(wrapper.text()).toContain("decisions.status.implemented");
    });

    it("names the report that supersedes one", async () => {
        const wrapper = await mountSuspended(DecisionsRow, {
            props: { report: { ...REPORT, decision: "superseded", supersededBy: "0012-later.md" } },
        });

        expect(wrapper.html()).toContain("decisions.supersededBy");
    });
});
