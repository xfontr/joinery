import { describe, expect, it } from "vitest";
import { compareDecisionShape, parseGateFindings } from "./invariants.ts";

describe("parseGateFindings", () => {
    it("keeps the gate's findings and drops its blocks flag, which the Overview has no column for", () => {
        const stdout = JSON.stringify([
            {
                id: "tag-table-unenforced",
                title: "t",
                detail: "d",
                evidence: ["README.md"],
                blocks: false,
            },
        ]);

        expect(parseGateFindings(`${stdout}\n`)).toEqual([
            { id: "tag-table-unenforced", title: "t", detail: "d", evidence: ["README.md"] },
        ]);
    });

    it("reports a gate that crashed instead of showing a clean Overview", () => {
        expect(parseGateFindings("Error: boom").map((finding) => finding.id)).toEqual([
            "invariants-gate-unreadable",
        ]);
    });
});

describe("compareDecisionShape", () => {
    const report = (issue: string) =>
        `---\nissue: ${issue}\nstatus: implemented\ndecision: accepted\n---\n\n# 🧭 A decision\n`;

    it("flags two reports sharing a number, the collision consecutive numbering exists to prevent", () => {
        const findings = compareDecisionShape([
            { file: "0001-first.md", source: report("1") },
            { file: "0001-second.md", source: report("2") },
        ]);

        expect(findings.map((finding) => finding.id)).toEqual(["decision-shape-mismatch"]);
        expect(findings[0]?.detail).toContain("0001-second.md");
    });

    it("stays silent on well-formed reports, so the Overview only lists real drift", () => {
        expect(compareDecisionShape([{ file: "0001-first.md", source: report("1") }])).toEqual([]);
    });
});
