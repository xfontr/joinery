import { defineEventHandler } from "h3";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import { readArtifact } from "#layers/snapshot/server/utils/store.ts";
import { ruleCounts } from "../../../shared/lintUsage.ts";

/** The lint rules switched on and how many are in-house, for the visitor pages. */
export default defineEventHandler(async () =>
    ruleCounts((await readArtifact<UsageArtifact>("usage"))?.lint),
);
