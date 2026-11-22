/** A tab a feature layer adds to every project page, fetched without the page importing the layer. */
export interface ProjectTab {
    label: string;
    /** A route answering with `ProjectTabRow[]` for every project, keyed by its folder. */
    rows: string;
    /** The page the whole dataset lives on. */
    to: string;
    empty: string;
}
