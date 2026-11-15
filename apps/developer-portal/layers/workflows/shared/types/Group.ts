/** A switchable bundle of capabilities, such as a blog, with no tickets or progress of its own. */
export interface Group {
    id: string;
    title: string;
    summary: string;
    optional: boolean;
    default: boolean;
}
