import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { AuditReport } from "#layers/audits/shared/auditReports.ts";
import AuditsTiles from "./AuditsTiles.vue";

const findings = (status: "open" | "fixed", count: number) =>
    Array.from({ length: count }, (_, index) => ({
        id: `${status}${index}`,
        category: "Bugs",
        status,
        ref: null,
    }));

const report = (id: string, open: number, fixed: number): AuditReport => ({
    path: `docs/audits/${id}.md`,
    id,
    date: "2026-11-01",
    title: id,
    scope: null,
    commit: null,
    findings: [...findings("open", open), ...findings("fixed", fixed)],
    state: open > 0 ? "open" : "closed",
    counts: { open, fixed, "wont-fix": 0 },
    updatedAt: null,
});

describe("AuditsTiles", () => {
    it("sums each finding status across every audit", async () => {
        const wrapper = await mountSuspended(AuditsTiles, {
            props: { reports: [report("a", 2, 1), report("b", 0, 4)] },
        });

        const values = wrapper.findAll("[data-figure]").map((value) => value.text());
        expect(values).toEqual(["2", "2", "5", "0"]);
    });
});
