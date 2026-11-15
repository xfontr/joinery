import type { SnapshotIssue } from "./SnapshotIssue.ts";

export interface UnsortedIssue {
    issue: SnapshotIssue;
    reason: string;
}
