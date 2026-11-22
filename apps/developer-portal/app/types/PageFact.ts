export interface PageFact {
    label: string;
    value: string;
    class?: string;
    /** Set on a figure that also picks what the page's chart draws. */
    series?: string;
}
