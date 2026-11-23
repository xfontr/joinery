import type { WorkStudy } from "./WorkStudy.ts";

/** A study with every field its page prints; its story is the markdown body. */
export interface WorkCase extends WorkStudy {
    why: string;
    countedOn: string;
    /** The work, and so the study, is still being written. */
    inProgress: boolean;
    design: { label: string; value: string }[];
    decisions: { id: string; question: string; answer: string }[];
}
