/** One line of a new project's estimate: the core, a feature switched on, or a page. */
export interface ReceiptRow {
    /** `core` for the core build, which carries no label of its own. */
    id: string;
    /** Empty for the core build and for a page not named yet. */
    label: string;
    /** A page's type, by its title; null for the core and for a feature. */
    type: string | null;
    /** The titles of the on-demand blocks a page's points include. */
    setup: string[];
    points: number;
    /** A feature inside another, such as comments in the blog. */
    nested: boolean;
}
