import type { Capability } from "./Capability.ts";
import type { SettledState } from "./SettledState.ts";
import type { TicketSize } from "./TicketSize.ts";

export interface Project {
    id: string;
    title: string;
    template: string;
    area: string;
    milestone: string;
    summary: string;
    switches: Record<string, boolean>;
    ticketSize: TicketSize;
    /** `on` is the day it was settled, so a replay of an earlier day doesn't count it yet. */
    settled: Record<string, { status: SettledState; note: string; on: string | null }>;
    extras: Capability[];
}
