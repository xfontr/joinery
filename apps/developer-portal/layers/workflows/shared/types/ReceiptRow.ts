/** One line of a new project's estimate: the core, a feature switched on, or a page. */
export interface ReceiptRow {
    id: string;
    label: string;
    detail: string | null;
    points: number;
    /** A feature inside another, such as comments in the blog. */
    nested: boolean;
}
