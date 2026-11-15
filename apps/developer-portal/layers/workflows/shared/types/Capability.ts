import type { Kind } from "./Kind.ts";
import type { Lesson } from "./Lesson.ts";
import type { ReusePlan } from "./ReusePlan.ts";
import type { SuggestedTicket } from "./SuggestedTicket.ts";

export interface Capability {
    id: string;
    stage: string;
    /** A group switches every capability in it off at once, across stages. */
    group: string | null;
    title: string;
    summary: string;
    kind: Kind;
    optional: boolean;
    /** Whether an optional capability starts switched on; always true for a required one. */
    default: boolean;
    /** No switch: in the map only while an extra depends on it, so a setup is paid for once. */
    onDemand: boolean;
    dependsOn: string[];
    doneWhen: string[];
    reuse: { plan: ReusePlan; from: string | null } | null;
    lessons: Lesson[];
    tickets: SuggestedTicket[];
    /** The whole block's estimate, used until its tickets carry their own. */
    complexity: number | null;
}
