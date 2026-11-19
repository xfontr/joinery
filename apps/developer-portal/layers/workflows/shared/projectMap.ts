import type { CapabilityState } from "./types/CapabilityState.ts";
import type { MapTone } from "./types/MapTone.ts";
import type { ProjectView } from "./types/ProjectView.ts";

const COLUMN = 184;
const NODE_WIDTH = 164;
const NODE_HEIGHT = 30;
const ROW = 40;
const HEADER = 36;
const MAX_CHARS = 21;

const toneOf = (state: CapabilityState): MapTone => {
    if (state === "done" || state === "skipped") return "done";
    if (state === "waits" || state === "blocked") return "waiting";
    return "moving";
};

const clip = (text: string): string =>
    text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS - 1).trimEnd()}…` : text;

/** A project as a static map: stages become columns, blocks rows, and each need one curve. */
export const projectMap = (view: ProjectView) => {
    const stages = view.stages
        .map((stage) => ({ ...stage, blocks: stage.capabilities.filter((block) => block.enabled) }))
        .filter((stage) => stage.blocks.length > 0);

    const nodes = stages.flatMap((stage, column) =>
        stage.blocks.map((block, row) => ({
            id: block.id,
            title: block.title,
            label: clip(block.title),
            tone: toneOf(block.state),
            owner: block.kind === "owner",
            x: column * COLUMN,
            y: HEADER + row * ROW,
        })),
    );
    const byId = new Map(nodes.map((node) => [node.id, node]));

    const edges = stages.flatMap((stage) =>
        stage.blocks.flatMap((block) => {
            const to = byId.get(block.id)!;
            return block.needs.flatMap((need) => {
                const from = byId.get(need);
                if (!from) return [];
                const x1 = from.x + NODE_WIDTH;
                const y1 = from.y + NODE_HEIGHT / 2;
                const x2 = to.x;
                const y2 = to.y + NODE_HEIGHT / 2;
                const bend = Math.max(NODE_WIDTH, (x2 - x1) / 2);
                return [
                    {
                        id: `${need}-${block.id}`,
                        d: `M${x1} ${y1} C${x1 + bend} ${y1} ${x2 - bend} ${y2} ${x2} ${y2}`,
                    },
                ];
            });
        }),
    );

    const issues = view.snapshot?.issues.filter((issue) => issue.reason !== "not_planned");

    return {
        stages: stages.map((stage, column) => ({
            id: stage.id,
            title: stage.title,
            x: column * COLUMN,
            blocks: nodes.filter((node) => node.x === column * COLUMN),
        })),
        nodes,
        edges,
        width: Math.max(0, stages.length * COLUMN - (COLUMN - NODE_WIDTH)),
        height: HEADER + Math.max(0, ...stages.map((stage) => stage.blocks.length)) * ROW,
        nodeWidth: NODE_WIDTH,
        nodeHeight: NODE_HEIGHT,
        blocks: {
            done: nodes.filter((node) => node.tone === "done").length,
            moving: nodes.filter((node) => node.tone === "moving").length,
            total: nodes.length,
        },
        tickets: issues
            ? {
                  closed: issues.filter((issue) => issue.state === "closed").length,
                  total: issues.length,
              }
            : null,
    };
};

export type ProjectMap = ReturnType<typeof projectMap>;
