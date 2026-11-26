/**
 * A tab a feature layer adds to every project page, fetched without the page importing the layer;
 * its label and empty line are the `projectTabs.<id>` copy.
 */
export interface ProjectTab {
    /** A route answering with `ProjectTabRow[]` for every project, keyed by its folder. */
    rows: string;
    /** The page the whole dataset lives on. */
    to: string;
}
