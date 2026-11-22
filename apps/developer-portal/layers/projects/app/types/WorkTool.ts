import type { WorkBase } from "#layers/projects/app/types/WorkBase.ts";

/** A tool, which links straight to `live` instead of to a study at `/work/<slug>`. */
export interface WorkTool extends WorkBase {
    caseStudy: false;
}
