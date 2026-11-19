export type Tone = "good" | "warn" | "bad" | "neutral";

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

/** "3 hours ago" beats a timestamp for the one question a report page has to answer. */
export const relativeTime = (iso: string | null | undefined): string => {
    if (!iso) return "never";

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

    // The largest unit the gap fills at least once — "3 hours ago", never "180 minutes ago".
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
    { label: "y", size: 31_536_000 },
    { label: "mo", size: 2_592_000 },
    { label: "d", size: 86_400 },
    { label: "h", size: 3600 },
    { label: "min", size: 60 },
] as const;

/** "23 h", "2 d": an age that fits a figure column on a phone. */
export const shortAge = (iso: string | null | undefined): string => {
    if (!iso) return "never";

    const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    const unit = SHORT_UNITS.find((entry) => seconds >= entry.size);

    return unit ? `${Math.floor(seconds / unit.size)} ${unit.label}` : "now";
};
