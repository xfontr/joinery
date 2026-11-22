import { countAll } from "#layers/audits/shared/auditReports.ts";
import { countByStatus } from "#layers/decisions/shared/decisionReports.ts";
import { worstSeverity } from "#layers/snapshot/shared/deps.ts";
import { isFailing, scriptRows, sumDays } from "#layers/telemetry/shared/usageView.ts";
import type { HealthLine } from "~/types/HealthLine";

const FULL = 100;

/** Home's Health panel: one figure per area, each with the split behind it. */
export const useHealthLines = () => {
    const coverage = coverageArtifact();
    const deps = depsArtifact();
    const usage = usageArtifact();
    const docs = docsArtifact();
    const decisions = useDecisionReports();
    const audits = useAuditReports();

    return computed((): HealthLine[] => {
        const lines = coverage?.totals?.lines ?? null;
        const counts = deps?.vulnerabilities ?? null;
        const worst = worstSeverity(counts);
        const runs = sumDays(usage ? scriptRows(usage) : []);
        const decided = countByStatus(decisions.value);
        const { findings } = countAll(audits.value);

        return [
            {
                label: "Line coverage",
                value: dash(lines, "%"),
                tone: coverageTone(lines),
                to: "/coverage",
                legend: false,
                parts: [
                    { label: "covered", value: lines ?? 0, tone: "ink" },
                    { label: "uncovered", value: FULL - (lines ?? 0), tone: "soft" },
                ],
            },
            {
                label: "Advisories",
                value: counts ? String(deps?.advisories.length ?? 0) : "—",
                tone: worst ? severityTone(worst) : "neutral",
                to: "/deps",
                legend: true,
                parts: [
                    { label: "critical", value: counts?.critical ?? 0, tone: "bad" },
                    { label: "high", value: counts?.high ?? 0, tone: "bad" },
                    { label: "moderate", value: counts?.moderate ?? 0, tone: "warn" },
                    { label: "low", value: counts?.low ?? 0, tone: "soft" },
                ],
            },
            {
                label: "Tooling runs failed",
                value: runs.runs ? `${percentOf(runs.failures, runs.runs)}%` : "—",
                tone: runs.runs && isFailing(runs) ? "bad" : "neutral",
                to: "/telemetry",
                legend: true,
                parts: [
                    { label: "passed", value: runs.runs - runs.failures, tone: "ink" },
                    { label: "failed", value: runs.failures, tone: "bad" },
                ],
            },
            {
                label: "Decisions implemented",
                value: String(decided.implemented),
                tone: "neutral",
                to: "/decisions",
                legend: true,
                parts: [
                    { label: "implemented", value: decided.implemented, tone: "ink" },
                    { label: "to implement", value: decided["to-implement"], tone: "soft" },
                ],
            },
            {
                label: "Audit findings open",
                value: String(findings.open),
                tone: "neutral",
                to: "/audits",
                legend: false,
                parts: [
                    { label: "open", value: findings.open, tone: "warn" },
                    { label: "fixed", value: findings.fixed ?? 0, tone: "soft" },
                ],
            },
            {
                label: "Doc pages",
                value: docs ? String(docs.pages.length) : "—",
                tone: docs?.brokenLinkCount ? "bad" : "neutral",
                to: "/wiki",
                legend: false,
                parts: [],
                note: docs?.brokenLinkCount
                    ? counted(docs.brokenLinkCount, "broken link")
                    : "No broken links",
            },
        ];
    });
};
