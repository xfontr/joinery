/** Complexity summed over filed tickets, and over the template's estimate for blocks not yet filed. */
export interface Points {
    done: number;
    total: number;
    /** How much of `total` is still the template's guess rather than tickets' own estimates. */
    estimated: number;
    /** Tickets or unfiled blocks with no figure at all, which `total` leaves out. */
    unestimated: number;
}
