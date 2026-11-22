import { isFailing, scriptRows, sumDays } from "#layers/telemetry/shared/usageView.ts";
import type { PageFact } from "~/types/PageFact";

/** The usage snapshot and the header facts drawn from it. */
export const useTelemetryPage = () => {
    const usage = usageArtifact();
    const rows = usage ? scriptRows(usage) : [];
    const sum = sumDays(rows);

    const share = (part: number): string => (sum.runs ? `${percentOf(part, sum.runs)}%` : "—");

    const facts: PageFact[] = [
        { label: "Runs", value: String(sum.runs), series: "runs" },
        { label: "By agents", value: share(sum.agent), series: "agent" },
        {
            label: "Failed",
            value: share(sum.failures),
            class: isFailing(sum) ? "tone-bad" : "",
            series: "failures",
        },
        { label: "Scripts", value: String(rows.length) },
        { label: "Never run", value: String(rows.filter((row) => row.runs === 0).length) },
    ];

    return {
        usage,
        hasRuns: Object.keys(usage?.scripts ?? {}).length > 0,
        provenance: `Usage log · last ${usage?.windowDays ?? "—"} days · collected ${relativeTime(usage?.generatedAt)}`,
        facts,
    };
};
