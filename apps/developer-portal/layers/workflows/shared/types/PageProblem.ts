/** Why a page the wizard adds can't be written yet, worded by the page that shows it. */
export interface PageProblem {
    code: "untitled" | "noId" | "taken" | "duplicate";
    /** The block id the page's title makes. */
    id: string;
}
