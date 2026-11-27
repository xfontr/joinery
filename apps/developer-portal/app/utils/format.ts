import type { Tone } from "~/types/Tone";
import type { Translate } from "~/types/Translate";

const TONE_CLASSES = {
    good: "tone-good",
    warn: "tone-warn",
    bad: "tone-bad",
    neutral: "",
} as const satisfies Record<Tone, string>;

/** Empty for `neutral`, which takes whatever colour its surroundings already have. */
export const toneClass = (tone: Tone): string => TONE_CLASSES[tone];

/** A `YYYY-MM-DD` calendar day as "6 Oct", read in UTC so the server and the browser agree. */
export const calendarDay = (day: string, month: "short" | "only" = "short"): string =>
    new Date(`${day}T00:00:00Z`).toLocaleDateString(
        "en-GB",
        month === "only"
            ? { timeZone: "UTC", month: "short" }
            : { timeZone: "UTC", day: "numeric", month: "short" },
    );

/** An ISO instant as "27 Nov, 14:02 UTC", read in UTC so the server and the browser agree. */
export const calendarTime = (iso: string): string =>
    new Date(iso).toLocaleString("en-GB", {
        timeZone: "UTC",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
    });

export const relativeTime = (iso: string | null | undefined, t: Translate): string => {
    if (!iso) return t("common.never");

    const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);

    const smallest = { unit: "second" as Intl.RelativeTimeFormatUnit, size: 1 };

    const scale = [
        smallest,
        { unit: "minute" as Intl.RelativeTimeFormatUnit, size: 60 },
        { unit: "hour" as Intl.RelativeTimeFormatUnit, size: 3600 },
        { unit: "day" as Intl.RelativeTimeFormatUnit, size: 86_400 },
        { unit: "month" as Intl.RelativeTimeFormatUnit, size: 2_592_000 },
        { unit: "year" as Intl.RelativeTimeFormatUnit, size: 31_536_000 },
    ];

    const step = scale.findLast((entry) => Math.abs(seconds) >= entry.size) ?? smallest;

    return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
        -Math.round(seconds / step.size),
        step.unit,
    );
};

/** The one threshold pair in the app, so the overview tile and the coverage table cannot disagree. */
export const coverageTone = (pct: number | null | undefined): Tone => {
    if (pct === null || pct === undefined) return "neutral";
    if (pct >= 80) return "good";
    if (pct >= 60) return "warn";

    return "bad";
};

/** `pnpm audit`'s own five-band scale, collapsed to the app's three tones. */
export const severityTone = (severity: "info" | "low" | "moderate" | "high" | "critical"): Tone => {
    if (severity === "critical" || severity === "high") return "bad";
    if (severity === "moderate") return "warn";

    return "neutral";
};

const SHORT_UNITS = [
    { unit: "years", size: 31_536_000 },
    { unit: "months", size: 2_592_000 },
    { unit: "days", size: 86_400 },
    { unit: "hours", size: 3600 },
    { unit: "minutes", size: 60 },
] as const;

/** "23 h", "2 d": an age that fits a figure column on a phone. */
export const shortAge = (iso: string | null | undefined, t: Translate): string => {
    if (!iso) return t("common.never");

    const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    const step = SHORT_UNITS.find((entry) => seconds >= entry.size);

    return step
        ? t(`common.shortAge.${step.unit}`, { count: Math.floor(seconds / step.size) })
        : t("common.now");
};

/** The last path segment, which names a project's page under `/projects/`. */
export const folderOf = (root: string): string => root.split("/").at(-1) ?? root;

/** A metric with its unit, or a dash for a project nothing collected it for. */
export const dash = (value: number | null | undefined, unit = ""): string =>
    typeof value === "number" ? `${value}${unit}` : "—";
