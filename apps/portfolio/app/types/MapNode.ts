import type { MapTone } from "./MapTone.ts";

export interface MapNode {
    id: string;
    title: string;
    label: string;
    tone: MapTone;
    owner: boolean;
    x: number;
    y: number;
}
