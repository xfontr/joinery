import type { IssuesRead } from "#layers/github/app/utils/issues.ts";
import type { Badges } from "#layers/snapshot/shared/types/Badges.ts";
import type { NavLink } from "~/types/NavLink";
import type { RailFigure } from "~/types/RailFigure";
import type { StatusItem } from "~/types/StatusItem";
import type { Tone } from "~/types/Tone";
import type { Translate } from "~/types/Translate";

interface ShellFigure {
    badge?: { label: string; class: string };
    status?: StatusItem;
}

const badge = (label: string, tone: Tone) => ({ label, class: toneClass(tone) });

const percent = (value: number | null): string => (value === null ? "—" : `${value}%`);

const coverageFigure = (lines: number | null, to: string, t: Translate): ShellFigure => ({
    badge: lines === null ? undefined : badge(percent(lines), coverageTone(lines)),
    status: {
        id: "coverage",
        label: t("statusBar.items.coverage"),
        value: percent(lines),
        detail: t("statusBar.items.lines"),
        tone: coverageTone(lines),
        to,
    },
});

const depsFigure = (badges: Badges | null, to: string, t: Translate): ShellFigure => {
    const worst = badges?.worstSeverity ?? null;
    const tone: Tone = worst ? severityTone(worst) : "neutral";
    const advisories = badges?.collected ? String(badges.advisories) : null;

    return {
        badge:
            advisories === null
                ? undefined
                : badge(t("statusBar.items.advisoriesBadge", { count: advisories }), tone),
        status: {
            id: "advisories",
            label: t("statusBar.items.advisories"),
            value: advisories ?? "—",
            detail: worst
                ? t("statusBar.items.worst", { severity: worst })
                : t("statusBar.items.none"),
            tone,
            to,
        },
    };
};

const toolingFigure = (tooling: RailFigure | null, to: string, t: Translate): ShellFigure => {
    if (!tooling) return {};
    const tone: Tone = tooling.alert ? "bad" : "neutral";

    return {
        badge: badge(t("statusBar.items.toolingBadge", { count: tooling.value }), tone),
        status: {
            id: "tooling",
            label: t("statusBar.items.tooling"),
            value: tooling.value,
            detail: t("statusBar.items.failed"),
            tone,
            to,
        },
    };
};

const issuesFigure = (read: IssuesRead, to: string, t: Translate): ShellFigure => {
    const open = read.fetchedAt && !read.error ? read.issues.length : null;

    return {
        badge: open ? badge(String(open), "neutral") : undefined,
        status: {
            id: "issues",
            label: t("statusBar.items.issues"),
            value: open === null ? "—" : String(open),
            detail: t("statusBar.items.open"),
            tone: read.error ? "warn" : "neutral",
            to,
        },
    };
};

const docsFigure = (badges: Badges | null, to: string, t: Translate): ShellFigure => {
    const pages = badges?.docPages ?? null;
    const broken = badges?.brokenLinks ?? 0;

    return {
        status: {
            id: "docs",
            label: t("statusBar.items.docs"),
            value: pages === null ? "—" : String(pages),
            detail: t("statusBar.items.brokenLinks", broken),
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
    const badges = shellBadges();
    const { t } = useI18n();

    const figureReads = Object.entries(nav).flatMap(([key, link]) =>
        link?.figure
            ? [{ key, read: useFetch<RailFigure>(link.figure, { key: `figure-${key}` }) }]
            : [],
    );
    const figureOf = (key: string): RailFigure | null =>
        figureReads.find((entry) => entry.key === key)?.read.data.value ?? null;
    const toOf = (key: string): string => nav[key]?.to ?? "/";

    const figures = computed((): Record<string, ShellFigure> => ({
        coverage: coverageFigure(badges?.lineCoverage ?? null, toOf("coverage"), t),
        deps: depsFigure(badges, toOf("deps"), t),
        telemetry: toolingFigure(figureOf("telemetry"), toOf("telemetry"), t),
        issues: issuesFigure(issues.value, toOf("issues"), t),
        docs: docsFigure(badges, toOf("docs"), t),
    }));

    return {
        figures,
        collected: badges?.collected ?? null,
        ready: Promise.all(figureReads.map((entry) => entry.read)),
    };
};
