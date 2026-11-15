import type { Capability } from "./Capability.ts";
import type { Group } from "./Group.ts";
import type { Stage } from "./Stage.ts";

export interface Template {
    id: string;
    title: string;
    summary: string;
    stages: Stage[];
    groups: Group[];
    capabilities: Capability[];
    /** Blocks a project adds as many times as it needs, each an extra naming one with `type:`. */
    types: Capability[];
}
