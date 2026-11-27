import { defineEventHandler } from "h3";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import { readArtifact } from "#layers/snapshot/server/utils/store.ts";
import { isFailing, scriptRows, sumDays } from "../../../shared/usageView.ts";

/** The share of tooling runs that failed, for the rail and the status bar. */
export default defineEventHandler(async () => {
    const usage = await readArtifact<UsageArtifact>("usage");
    const sum = usage ? sumDays(scriptRows(usage)) : null;

    if (!sum?.known) return { value: "—", alert: false };

    return { value: `${Math.round((sum.failures / sum.known) * 100)}%`, alert: isFailing(sum) };
});
