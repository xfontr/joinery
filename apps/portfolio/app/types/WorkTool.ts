import type { WorkBase } from "./WorkBase.ts";

/** A tool, which links straight to `live` instead of to a study at `/work/<slug>`. */
export interface WorkTool extends WorkBase {
    caseStudy: false;
}
