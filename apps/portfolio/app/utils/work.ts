import type { Work } from "../types/Work.ts";
import type { WorkCase } from "../types/WorkCase.ts";
import type { WorkStudy } from "../types/WorkStudy.ts";

export const WORK_PATH = "/work/";

export const WORK_FIELDS = [
    "path",
    "order",
    "name",
    "kind",
    "stage",
    "line",
    "live",
    "caseStudy",
    "title",
    "mark",
    "facts",
    "screenshot",
] as const;

export type WorkRow = Pick<Work, "name" | "kind" | "stage" | "line" | "live"> &
    Partial<Pick<WorkStudy, "title" | "mark" | "facts" | "screenshot">> & {
        path: string;
        caseStudy: boolean;
    };

export const isStudy = (work: Work): work is WorkStudy => work.caseStudy;

/** A row that claims a study but lacks a field the lists print is listed as a tool, never as a broken study. */
export const toWork = (row: WorkRow): Work => {
    const { name, kind, stage, line, live, title, mark, facts, screenshot } = row;
    const base = { slug: row.path.slice(WORK_PATH.length), name, kind, stage, line, live };

    if (row.caseStudy && title && mark && facts && screenshot) {
        return { ...base, caseStudy: true, title, mark, facts, screenshot };
    }

    return { ...base, caseStudy: false };
};

type WorkCaseRow = WorkRow &
    Partial<Pick<WorkCase, "why" | "countedOn" | "design" | "decisions">> & {
        inProgress?: boolean;
    };

/** A case study is an entry with every field its page prints; one missing one reads as no study. */
export const toWorkCase = (row: WorkCaseRow | null | undefined): WorkCase | null => {
    if (!row) return null;

    const work = toWork(row);
    const { why, countedOn, design, decisions } = row;

    if (!isStudy(work) || !why || !countedOn || !design || !decisions) return null;

    return { ...work, why, countedOn, design, decisions, inProgress: row.inProgress ?? false };
};
