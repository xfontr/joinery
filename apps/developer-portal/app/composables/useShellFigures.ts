import type { IssuesRead } from "#layers/github/app/utils/issues.ts";
import type { Badges } from "#layers/snapshot/shared/types/Badges.ts";
import type { NavLink } from "~/types/NavLink";
import type { RailFigure } from "~/types/RailFigure";
import type { StatusItem } from "~/types/StatusItem";
import type { Tone } from "~/types/Tone";

interface ShellFigure {
    badge?: { label: string; class: string };
    status?: StatusItem;
}

const badge = (label: string, tone: Tone) => ({ label, class: toneClass(tone) });

const percent = (value: number | null): string => (value === null ? "—" : `${value}%`);

const coverageFigure = (lines: number | null, to: string): ShellFigure => ({
    badge: lines === null ? undefined : badge(percent(lines), coverageTone(lines)),
    status: {
        id: "coverage",
        label: "coverage",
        value: percent(lines),
        detail: "lines",
        tone: coverageTone(lines),
        to,
    },
});

const depsFigure = (badges: Badges | null, to: string): ShellFigure => {
    const worst = badges?.worstSeverity ?? null;
    const tone: Tone = worst ? severityTone(worst) : "neutral";
    const advisories = badges?.collected ? String(badges.advisories) : null;

    return {
        badge: advisories === null ? undefined : badge(`${advisories} adv.`, tone),
        status: {
            id: "advisories",
            label: "advisories",
            value: advisories ?? "—",
            detail: worst ? `worst ${worst}` : "none",
            tone,
            to,
        },
    };
};

const toolingFigure = (tooling: RailFigure | null, to: string): ShellFigure => {
    if (!tooling) return {};
    const tone: Tone = tooling.alert ? "bad" : "neutral";

    return {
        badge: badge(`${tooling.value} fail`, tone),
        status: {
            id: "tooling",
            label: "tooling",
            value: tooling.value,
            detail: "failed",
            tone,
            to,
        },
    };
};

const issuesFigure = (read: IssuesRead, to: string): ShellFigure => {
    // GitHub is read in the browser, so the prerendered HTML can't know the count.
    const open = read.fetchedAt && !read.error ? read.issues.length : null;

    return {
        badge: open ? badge(String(open), "neutral") : undefined,
        status: {
            id: "issues",
            label: "issues",
            value: open === null ? "—" : String(open),
            detail: "open",
            tone: read.error ? "warn" : "neutral",
            to,
        },
    };
};

const docsFigure = (badges: Badges | null, to: string): ShellFigure => {
    const pages = badges?.docPages ?? null;
    const broken = badges?.brokenLinks ?? 0;

    return {
        status: {
            id: "docs",
            label: "docs",
            value: pages === null ? "—" : String(pages),
            detail: broken > 0 ? counted(broken, "broken link") : "no broken links",
            tone: broken > 0 ? "bad" : "neutral",
            to,
        },
    };
};

/**
 * Each nav entry's rail badge and status-bar line, keyed like `APPS`, from the snapshot badges,
 * the live issue read and the entries' `figure` routes; `ready` settles once the routes answer.
 */
export const useShellFigures = () => {
    const { nav }: { nav: Record<string, NavLink | undefined> } = useAppConfig();
    const { shown: issues } = useIssues();
    const badgesRead = useFetch<Badges>("/api/badges", { key: "badges" });
    const badges = badgesRead.data;

    const figureReads = Object.entries(nav).flatMap(([key, link]) =>
        link?.figure
            ? [{ key, read: useFetch<RailFigure>(link.figure, { key: `figure-${key}` }) }]
            : [],
    );
    const figureOf = (key: string): RailFigure | null =>
        figureReads.find((entry) => entry.key === key)?.read.data.value ?? null;
    const toOf = (key: string): string => nav[key]?.to ?? "/";

    const figures = computed((): Record<string, ShellFigure> => ({
        coverage: coverageFigure(badges.value?.lineCoverage ?? null, toOf("coverage")),
        deps: depsFigure(badges.value ?? null, toOf("deps")),
        telemetry: toolingFigure(figureOf("telemetry"), toOf("telemetry")),
        issues: issuesFigure(issues.value, toOf("issues")),
        docs: docsFigure(badges.value ?? null, toOf("docs")),
    }));

    return {
        figures,
        collected: computed(() => badges.value?.collected ?? null),
        ready: Promise.all([badgesRead, ...figureReads.map((entry) => entry.read)]),
    };
};
