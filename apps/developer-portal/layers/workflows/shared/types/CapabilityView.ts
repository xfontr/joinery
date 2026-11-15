import type { Capability } from "./Capability.ts";
import type { CapabilityState } from "./CapabilityState.ts";
import type { Points } from "./Points.ts";
import type { SnapshotIssue } from "./SnapshotIssue.ts";

export interface CapabilityView extends Capability {
    state: CapabilityState;
    enabled: boolean;
    extra: boolean;
    note: string | null;
    /** Its tickets as of the day viewed: filed by then, with their state on that day. */
    issues: SnapshotIssue[];
    /** What it needs once switched-off blocks are taken out: their own needs take their place. */
    needs: string[];
    /** The blocks that need it, after the same re-routing. */
    unblocks: string[];
    /** The needs that aren't finished, which is why it is blocked or can't be filed yet. */
    waitingOn: string[];
    /** Unfinished blocks behind it, directly or through others. */
    unblockCount: number;
    points: Points;
}
