import type { SplitPart } from "./SplitPart.ts";
import type { Tone } from "./Tone.ts";

export interface HealthLine {
    label: string;
    value: string;
    tone: Tone;
    to: string;
    parts: SplitPart[];
    legend: boolean;
}
