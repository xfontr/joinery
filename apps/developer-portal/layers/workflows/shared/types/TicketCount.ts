import type { TicketSize } from "./TicketSize.ts";

export interface TicketCount {
    /** Tickets in the milestone that carry a capability label, dropped ones left out. */
    filed: number;
    /** The tickets the blocks still to file would become, under each ticket size. */
    toFile: Record<TicketSize, number>;
}
