/** One switch in a project's plan: a group of blocks such as a blog, or a single optional block. */
export interface Feature {
    id: string;
    title: string;
    summary: string;
    enabled: boolean;
    /** The blocks it brings in, each with the template's estimate. */
    blocks: { title: string; complexity: number | null }[];
    /** The blocks' estimates summed. */
    points: number;
    /** The feature it sits inside, which has to be on for this one to be. */
    within: string | null;
}
