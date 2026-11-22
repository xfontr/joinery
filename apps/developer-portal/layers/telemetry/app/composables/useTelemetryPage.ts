import { isFailing, scriptRows, sumDays } from "#layers/telemetry/shared/usageView.ts";
import type { PageFact } from "~/types/PageFact";

/** The usage snapshot and the header facts drawn from it; `ready` settles once it loads. */
export const useTelemetryPage = () => {
    const snapshot = useSnapshot("usage");
    const usage = computed(() => snapshot.data.value?.usage ?? null);

    const rows = computed(() => (usage.value ? scriptRows(usage.value) : []));
    const sum = computed(() => sumDays(rows.value));

    const share = (part: number): string =>
        sum.value.runs ? `${percentOf(part, sum.value.runs)}%` : "—";

    const facts = computed((): PageFact[] => [
        { label: "Runs", value: String(sum.value.runs), series: "runs" },
        { label: "By agents", value: share(sum.value.agent), series: "agent" },
        {
            label: "Failed",
            value: share(sum.value.failures),
            class: isFailing(sum.value) ? "tone-bad" : "",
            series: "failures",
        },
        { label: "Scripts", value: String(rows.value.length) },
        { label: "Never run", value: String(rows.value.filter((row) => row.runs === 0).length) },
    ]);

    return {
        usage,
        hasRuns: computed(() => Object.keys(usage.value?.scripts ?? {}).length > 0),
        provenance: computed(
            () =>
                `Usage log · last ${usage.value?.windowDays ?? "—"} days · collected ${relativeTime(usage.value?.generatedAt)}`,
        ),
        facts,
        ready: snapshot,
    };
};
