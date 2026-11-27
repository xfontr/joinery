import {
    checkDurations,
    formatMs,
    isFailing,
    scriptRows,
    sumDays,
} from "#layers/telemetry/shared/usageView.ts";
import type { PageFact } from "~/types/PageFact";

/** The usage snapshot and the header facts drawn from it. */
export const useTelemetryPage = () => {
    const { t } = useI18n();
    const usage = usageArtifact();
    const rows = usage ? scriptRows(usage) : [];
    const sum = sumDays(rows);
    const check = usage ? checkDurations(usage) : null;

    const share = (part: number, whole = sum.runs): string =>
        whole ? `${percentOf(part, whole)}%` : "—";

    const facts: PageFact[] = [
        { label: t("telemetry.facts.runs"), value: String(sum.runs), series: "runs" },
        { label: t("telemetry.facts.agent"), value: share(sum.agent), series: "agent" },
        {
            label: t("telemetry.facts.failed"),
            value: share(sum.failures, sum.known),
            class: isFailing(sum) ? "tone-bad" : "",
            series: "failures",
        },
        { label: t("telemetry.facts.check"), value: check ? formatMs(check.medianMs) : "—" },
        { label: t("telemetry.facts.scripts"), value: String(rows.length) },
        {
            label: t("telemetry.facts.neverRun"),
            value: String(rows.filter((row) => row.runs === 0).length),
        },
    ];

    return {
        usage,
        hasRuns: Object.keys({ ...usage?.scripts, ...usage?.tasks }).length > 0,
        provenance: t("telemetry.provenance", {
            days: usage?.windowDays ?? "—",
        }),
        facts,
    };
};
