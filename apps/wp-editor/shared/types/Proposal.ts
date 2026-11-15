export interface Proposal {
    content: string;
    title?: string;
    excerpt?: string;
    /** Set by the change-maker: why a human should double-check this one. Never sent to WordPress. */
    reviewRequested?: string;
}
