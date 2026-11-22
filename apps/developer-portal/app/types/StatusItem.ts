import type { Tone } from "~/types/Tone";

export interface StatusItem {
    id: string;
    label: string;
    value: string;
    detail: string;
    tone: Tone;
    to: string;
}
