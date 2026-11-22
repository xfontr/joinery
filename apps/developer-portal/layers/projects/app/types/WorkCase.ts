import type { WorkStudy } from "#layers/projects/app/types/WorkStudy.ts";

/** A study with every field its page prints; its story is the markdown body. */
export interface WorkCase extends WorkStudy {
    why: string;
    countedOn: string;
    design: { label: string; value: string }[];
    decisions: { id: string; question: string; answer: string }[];
}
