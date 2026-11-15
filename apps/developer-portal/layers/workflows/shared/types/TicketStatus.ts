import type { TICKET_STATUSES } from "../constants.ts";

export type TicketStatus = (typeof TICKET_STATUSES)[number];
