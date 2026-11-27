import { countAll } from "#layers/audits/shared/auditReports.ts";
import { countByStatus } from "#layers/decisions/shared/decisionReports.ts";
import { worstSeverity } from "#layers/snapshot/shared/deps.ts";
import { isFailing, scriptRows, sumDays } from "#layers/telemetry/app/utils/usageView.ts";
import type { HealthLine } from "~/types/HealthLine";

const FULL = 100;

/** Home's Health panel: one figure per area, each with the split behind it. */
export const useHealthLines = () => {
    const { t } = useI18n();
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
                label: t("healthLines.lines.coverage"),
                value: dash(lines, "%"),
                tone: coverageTone(lines),
                to: "/coverage",
                legend: false,
                parts: [
                    { label: t("healthLines.parts.covered"), value: lines ?? 0, tone: "ink" },
                    {
                        label: t("healthLines.parts.uncovered"),
                        value: FULL - (lines ?? 0),
                        tone: "soft",
                    },
                ],
            },
            {
                label: t("healthLines.lines.advisories"),
                value: counts ? String(deps?.advisories.length ?? 0) : "—",
                tone: worst ? severityTone(worst) : "neutral",
                to: "/deps",
                legend: true,
                parts: [
                    {
                        label: t("healthLines.parts.critical"),
                        value: counts?.critical ?? 0,
                        tone: "bad",
                    },
                    { label: t("healthLines.parts.high"), value: counts?.high ?? 0, tone: "bad" },
                    {
                        label: t("healthLines.parts.moderate"),
                        value: counts?.moderate ?? 0,
                        tone: "warn",
                    },
                    { label: t("healthLines.parts.low"), value: counts?.low ?? 0, tone: "soft" },
                ],
            },
            {
                label: t("healthLines.lines.tooling"),
                value: runs.known ? `${percentOf(runs.failures, runs.known)}%` : "—",
                tone: isFailing(runs) ? "bad" : "neutral",
                to: "/telemetry",
                legend: true,
                parts: [
                    {
                        label: t("healthLines.parts.passed"),
                        value: runs.known - runs.failures,
                        tone: "ink",
                    },
                    { label: t("healthLines.parts.failed"), value: runs.failures, tone: "bad" },
                ],
            },
            {
                label: t("healthLines.lines.decisions"),
                value: String(decided.implemented),
                tone: "neutral",
                to: "/decisions",
                legend: true,
                parts: [
                    {
                        label: t("healthLines.parts.implemented"),
                        value: decided.implemented,
                        tone: "ink",
                    },
                    {
                        label: t("healthLines.parts.toImplement"),
                        value: decided["to-implement"],
                        tone: "soft",
                    },
                ],
            },
            {
                label: t("healthLines.lines.audits"),
                value: String(findings.open),
                tone: "neutral",
                to: "/audits",
                legend: false,
                parts: [
                    { label: t("healthLines.parts.open"), value: findings.open, tone: "warn" },
                    {
                        label: t("healthLines.parts.fixed"),
                        value: findings.fixed ?? 0,
                        tone: "soft",
                    },
                ],
            },
            {
                label: t("healthLines.lines.docs"),
                value: docs ? String(docs.pages.length) : "—",
                tone: "neutral",
                to: "/wiki",
                legend: false,
                parts: [],
            },
        ];
    });
};
