/** One broken repo rule; every one fails the check. */
export interface Finding {
    id: string;
    title: string;
    detail: string;
    evidence: string[];
}
