import type { MapNode } from "./MapNode.ts";

/** A workflow project laid out by the portal: stages are columns, blocks rows, needs curves. */
export interface ProjectMap {
    stages: { id: string; title: string; x: number; blocks: MapNode[] }[];
    nodes: MapNode[];
    edges: { id: string; d: string }[];
    width: number;
    height: number;
    nodeWidth: number;
    nodeHeight: number;
    blocks: { done: number; moving: number; total: number };
    tickets: { closed: number; total: number } | null;
}
