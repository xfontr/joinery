import type { CapabilityView } from "./CapabilityView.ts";
import type { Points } from "./Points.ts";
import type { Progress } from "./Progress.ts";
import type { Stage } from "./Stage.ts";

export interface StageView extends Stage {
    capabilities: CapabilityView[];
    progress: Progress;
    points: Points;
}
