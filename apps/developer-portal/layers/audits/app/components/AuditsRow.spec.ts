import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { AuditReport } from "#layers/audits/shared/auditReports.ts";
import AuditsRow from "./AuditsRow.vue";

const finding = (id: string, status: "open" | "fixed") => ({
    id,
    category: "Bugs",
    status,
    ref: null,
});

const REPORT = {
    path: "docs/audits/2026-11-01-ui.md",
    id: "2026-11-01-ui",
    date: "2026-11-01",
    title: "UI audit",
    scope: "packages/ui",
    commit: null,
    findings: [finding("B1", "fixed"), finding("B2", "open"), finding("B3", "open")],
    state: "in-progress",
    counts: { open: 2, fixed: 1, "wont-fix": 0 },
    updatedAt: null,
} satisfies AuditReport;

describe("AuditsRow", () => {
    it("links to the audit and counts the findings settled out of all of them", async () => {
        const wrapper = await mountSuspended(AuditsRow, { props: { report: REPORT } });

        expect(wrapper.find("a").attributes("href")).toBe("/audits/2026-11-01-ui");
        expect(wrapper.text()).toContain("1/3");
    });

    it("draws an audit with no findings as an empty bar rather than failing to divide", async () => {
        const wrapper = await mountSuspended(AuditsRow, {
            props: {
                report: { ...REPORT, findings: [], counts: { open: 0, fixed: 0, "wont-fix": 0 } },
            },
        });

        expect(wrapper.text()).toContain("0/0");
        expect(wrapper.find("[role='progressbar']").attributes("aria-valuemax")).toBe("1");
    });
});
