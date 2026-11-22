import type { CapabilityState, ProjectView } from "#layers/workflows/shared/workflows.ts";

export type MapTone = "done" | "moving" | "waiting";

interface MapNode {
    id: string;
    title: string;
    tone: MapTone;
    owner: boolean;
    x: number;
    y: number;
}

interface MapEdge {
    id: string;
    d: string;
}

interface MapColumn {
    title: string;
    x: number;
}

interface MapScale {
    column: number;
    nodeWidth: number;
    nodeHeight: number;
    row: number;
    header: number;
}

/** Labelled boxes, for the middle page. */
export const FULL: MapScale = { column: 184, nodeWidth: 164, nodeHeight: 30, row: 40, header: 36 };

/** Unlabelled dots, for a glance on the front page. */
export const GLYPH: MapScale = { column: 52, nodeWidth: 10, nodeHeight: 10, row: 16, header: 0 };

const MAX_CHARS = 21;

const toneOf = (state: CapabilityState): MapTone => {
    if (state === "done" || state === "skipped") return "done";
    if (state === "waits" || state === "blocked") return "waiting";
    return "moving";
};

const clip = (text: string): string =>
    text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS - 1).trimEnd()}…` : text;

/** Stages become columns and blocks rows, with one curve from each block to every block it needs. */
export const layoutMap = (view: ProjectView, scale: MapScale = FULL) => {
    const {
        column: COLUMN,
        nodeWidth: NODE_WIDTH,
        nodeHeight: NODE_HEIGHT,
        row: ROW,
        header: HEADER,
    } = scale;
    const stages = view.stages
        .map((stage) => ({ ...stage, blocks: stage.capabilities.filter((block) => block.enabled) }))
        .filter((stage) => stage.blocks.length > 0);

    const nodes: MapNode[] = stages.flatMap((stage, column) =>
        stage.blocks.map((block, row) => ({
            id: block.id,
            title: clip(block.title),
            tone: toneOf(block.state),
            owner: block.kind === "owner",
            x: column * COLUMN,
            y: HEADER + row * ROW,
        })),
    );
    const byId = new Map(nodes.map((node) => [node.id, node]));

    const edges: MapEdge[] = stages.flatMap((stage) =>
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

    const columns: MapColumn[] = stages.map((stage, column) => ({
        title: stage.title,
        x: column * COLUMN,
    }));
    const rows = Math.max(...stages.map((stage) => stage.blocks.length));
    const issues = view.snapshot?.issues.filter((issue) => issue.reason !== "not_planned") ?? [];

    return {
        nodes,
        edges,
        columns,
        width: stages.length * COLUMN - (COLUMN - NODE_WIDTH),
        height: HEADER + rows * ROW,
        nodeWidth: NODE_WIDTH,
        nodeHeight: NODE_HEIGHT,
        tickets: {
            done: issues.filter((issue) => issue.state === "closed").length,
            total: issues.length,
        },
        blocks: {
            done: nodes.filter((node) => node.tone === "done").length,
            moving: nodes.filter((node) => node.tone === "moving").length,
            total: nodes.length,
        },
    };
};

export type WorkflowMap = ReturnType<typeof layoutMap>;
