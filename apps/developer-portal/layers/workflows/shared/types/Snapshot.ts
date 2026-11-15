import type { SnapshotIssue } from "./SnapshotIssue.ts";

export interface Snapshot {
    syncedAt: string;
    milestone: string;
    issues: SnapshotIssue[];
    /** Open issues with the project's area label and no milestone, typically filed by hand. */
    noMilestone: SnapshotIssue[];
}
