import type { WorkflowMap } from "./filing.ts";
import { CAPABILITY_LABEL_PREFIX, type Snapshot, type SnapshotIssue } from "./snapshot.ts";

const isDone = (issues: SnapshotIssue[], id: string): boolean => {
    const tickets = issues.filter((issue) => issue.caps.includes(id));
    return tickets.length > 0 && tickets.every((issue) => issue.state === "closed");
};

const whyUnplaced = (map: WorkflowMap, issue: SnapshotIssue): string | null => {
    if (issue.caps.length === 0) return `no ${CAPABILITY_LABEL_PREFIX} label`;

    const group = issue.caps.find((cap) => map.groups.includes(cap));
    if (group) return `${group} is a group; label one of its capabilities instead`;

    const known = new Map(map.blocks.map((block) => [block.id, block]));
    const unknown = issue.caps.filter((cap) => !known.has(cap));
    if (unknown.length > 0) return `unknown capability ${unknown.join(", ")}`;

    const off = issue.caps.every((cap) => {
        const block = known.get(cap);
        return !block || !map.isOn(block);
    });
    if (issue.state === "open" && off) return "its capability is switched off";

    return null;
};

/**
 * Every ticket the portal's map can't place, as `#N title: reason`. A ticket in the area but outside
 * the milestone only counts while the project still has work left.
 */
export const unplaced = (map: WorkflowMap, snapshot: Snapshot): string[] => {
    const left = map.blocks.some(
        (block) =>
            map.isOn(block) && !map.settled.has(block.id) && !isDone(snapshot.issues, block.id),
    );

    return [
        ...snapshot.issues.flatMap((issue) => {
            const reason = whyUnplaced(map, issue);
            return reason ? [`#${issue.number} ${issue.title}: ${reason}`] : [];
        }),
        ...(left
            ? snapshot.noMilestone.map(
                  (issue) => `#${issue.number} ${issue.title}: not in ${snapshot.milestone}`,
              )
            : []),
    ];
};
