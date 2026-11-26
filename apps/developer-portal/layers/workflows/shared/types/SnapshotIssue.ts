export interface SnapshotIssue {
    number: number;
    title: string;
    url: string;
    state: "open" | "closed";
    /** GitHub's `state_reason`, so a ticket closed as not planned doesn't count as delivered. */
    reason: "completed" | "not_planned" | null;
    caps: string[];
    /** Null in a snapshot synced before it was recorded, which a replay treats as always filed. */
    createdAt: string | null;
    closedAt: string | null;
    /** The author date of every commit tagged `[#N]` for this issue, ascending. */
    activity: string[];
    /**
     * GitHub's blocked-by links with each blocker's state and close date, since a blocker can sit
     * outside the milestone.
     */
    blockedBy: { number: number; open: boolean; closedAt: string | null }[];
    /** A branch is linked on the issue, which is how `pnpm issue:pick` marks it as taken. */
    branch: boolean;
    /** An open pull request would close it, so work started even without a linked branch. */
    pr: boolean;
    owner: boolean;
    /** The board's Complexity field; null when nobody estimated it. */
    complexity: number | null;
}
