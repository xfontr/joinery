export interface SplitPart {
    label: string;
    value: number;
    tone?: "ink" | "soft" | "good" | "warn" | "bad";
}
