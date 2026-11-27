import type { Badges } from "#layers/snapshot/shared/types/Badges.ts";
import type { NavLink } from "~/types/NavLink";
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

/** Each nav entry's rail badge and status-bar line, keyed like `APPS`, from the snapshot badges. */
export const useShellFigures = () => {
    const { nav }: { nav: Record<string, NavLink | undefined> } = useAppConfig();
    const badges = shellBadges();
    const { t } = useI18n();

    const toOf = (key: string): string => nav[key]?.to ?? "/";

    const figures = computed((): Record<string, ShellFigure> => ({
        coverage: coverageFigure(badges?.lineCoverage ?? null, toOf("coverage"), t),
        deps: depsFigure(badges, toOf("deps"), t),
    }));

    return { figures, collected: badges?.collected ?? null };
};
