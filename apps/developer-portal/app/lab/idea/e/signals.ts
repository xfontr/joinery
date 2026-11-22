import { isFailing, scriptRows, sumDays } from "#layers/telemetry/shared/usageView.ts";
import type { DepsArtifact } from "#layers/snapshot/shared/types/DepsArtifact.ts";
import type { DocsArtifact } from "#layers/snapshot/shared/types/DocsArtifact.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import type { IssuesRead } from "#layers/github/app/utils/issues.ts";
import type { Tone } from "~/types/Tone";
import { BASE } from "./apps";

const SEVERITIES = ["critical", "high", "moderate", "low", "info"] as const;

interface Signal {
    id: string;
    label: string;
    value: string;
    detail: string;
    tone: Tone;
    to: string | null;
}

const coverageSignal = (lines: number | null): Signal => ({
    id: "coverage",
    label: "coverage",
    value: lines === null ? "—" : `${lines}%`,
    detail: "lines",
    tone: coverageTone(lines),
    to: `${BASE}/health?tab=coverage`,
});

const advisorySignal = (deps: DepsArtifact | null): Signal => {
    const counts = deps?.vulnerabilities ?? null;
    const worst = counts ? (SEVERITIES.find((severity) => counts[severity] > 0) ?? null) : null;

    return {
        id: "advisories",
        label: "advisories",
        value: counts ? String(deps?.advisories.length ?? 0) : "—",
        detail: worst ? `worst ${worst}` : "none",
        tone: worst ? severityTone(worst) : "good",
        to: `${BASE}/health?tab=deps`,
    };
};

const toolingSignal = (usage: UsageArtifact | null): Signal => {
    const sum = usage ? sumDays(scriptRows(usage)) : null;

    return {
        id: "tooling",
        label: "tooling",
        value: sum ? `${percentOf(sum.failures, sum.runs)}%` : "—",
        detail: "failed",
        tone: sum && isFailing(sum) ? "bad" : "neutral",
        to: `${BASE}/health?tab=tooling`,
    };
};

const issueSignal = (issues: IssuesRead | null): Signal => ({
    id: "issues",
    label: "issues",
    value: issues?.fetchedAt && !issues.error ? String(issues.issues.length) : "—",
    detail: "open",
    tone: issues?.error ? "warn" : "neutral",
    to: null,
});

const docsSignal = (docs: DocsArtifact | null): Signal => ({
    id: "docs",
    label: "docs",
    value: docs ? String(docs.pages.length) : "—",
    detail: docs?.brokenLinkCount ? `${docs.brokenLinkCount} broken` : "no broken links",
    tone: docs?.brokenLinkCount ? "bad" : "neutral",
    to: null,
});

export const useSignals = () => {
    const { data: read } = useIssues();
    const mounted = ref(false);
    onMounted(() => (mounted.value = true));

    const coverage = coverageArtifact();
    const deps = depsArtifact();
    const docs = docsArtifact();
    const usage = usageArtifact();
    const manifest = snapshotManifest();

    const signals = computed<Signal[]>(() => [
        coverageSignal(coverage?.totals?.lines ?? null),
        advisorySignal(deps ?? null),
        toolingSignal(usage ?? null),
        issueSignal(mounted.value ? read.value : null),
        docsSignal(docs ?? null),
    ]);

    return { signals, manifest };
};
