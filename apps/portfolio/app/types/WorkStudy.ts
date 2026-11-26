import type { WorkBase } from "./WorkBase.ts";

/** An entry with a study at `/work/<slug>`, as the lists show it. */
export interface WorkStudy extends WorkBase {
    caseStudy: true;
    /** The headline is `title`, then `mark` in the accent. */
    title: string;
    mark: string;
    facts: string[];
    /** A file in `app/assets/work/`, captured at 1440 × 900. */
    screenshot: { file: string; alt: string; caption: string };
}
