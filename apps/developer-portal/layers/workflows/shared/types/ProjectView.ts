import type { CapabilityState } from "./CapabilityState.ts";
import type { CapabilityView } from "./CapabilityView.ts";
import type { Feature } from "./Feature.ts";
import type { Points } from "./Points.ts";
import type { Progress } from "./Progress.ts";
import type { Project } from "./Project.ts";
import type { Snapshot } from "./Snapshot.ts";
import type { StageView } from "./StageView.ts";
import type { Template } from "./Template.ts";
import type { TicketCount } from "./TicketCount.ts";
import type { UnsortedIssue } from "./UnsortedIssue.ts";

export interface ProjectView {
    project: Project;
    template: Template;
    /** Kept so the page can lay the same project over another day. */
    snapshot: Snapshot | null;
    /** The day viewed, or null for the snapshot as synced. */
    asOf: string | null;
    features: Feature[];
    stages: StageView[];
    capabilities: CapabilityView[];
    /** Every unfinished block, what needs the owner first, then most-unblocking first. */
    left: CapabilityView[];
    counts: Record<CapabilityState, number>;
    /** The longest chain of unfinished blocks, which decides when the project can finish. */
    critical: string[];
    unsorted: UnsortedIssue[];
    progress: Progress;
    points: Points;
    tickets: TicketCount;
    syncedAt: string | null;
}
