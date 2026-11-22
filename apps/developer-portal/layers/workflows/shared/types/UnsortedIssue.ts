import type { SnapshotIssue } from "./SnapshotIssue.ts";

export interface UnsortedIssue {
    issue: SnapshotIssue;
    /** Why it can't be placed, worded by the page that lists it. */
    reason: "noLabel" | "group" | "unknown" | "off" | "noMilestone";
    /** The label the reason is about: the group's id, or the unknown capabilities. */
    detail: string;
}
