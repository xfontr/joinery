const UNITS = [
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
    const unit = UNITS.find((entry) => seconds >= entry.size);

    return unit ? `${Math.floor(seconds / unit.size)} ${unit.label}` : "now";
};
