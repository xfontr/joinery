import { queryCollection } from "@nuxt/content/server";
import { defineEventHandler } from "h3";
import {
    BENCHMARKS_PATH,
    screenshotOf,
    sortBenchmarks,
    toBenchmarks,
} from "#layers/benchmarks/app/utils/benchmarks.ts";
import { toDecisionReports } from "#layers/decisions/shared/decisionReports.ts";
import { specTotal } from "#layers/snapshot/app/utils/metrics.ts";
import { readArtifact } from "#layers/snapshot/server/utils/store.ts";
import type { DocsArtifact } from "#layers/snapshot/shared/types/DocsArtifact.ts";
import type { MetricsArtifact } from "#layers/snapshot/shared/types/MetricsArtifact.ts";
import type { UsageArtifact } from "#layers/snapshot/shared/types/UsageArtifact.ts";
import { ruleCounts } from "#layers/telemetry/shared/lintUsage.ts";
import { loadWorkflows } from "#layers/workflows/server/utils/workflows.ts";
import { projectMap } from "#layers/workflows/server/utils/projectMap.ts";
import { lessonCount } from "#layers/workflows/shared/workflows.ts";

/** Every figure `apps/portfolio` shows, which it fetches at build; paths are relative to this site. */
export default defineEventHandler(async (event) => {
    const [pages, docs, metrics, usage, workflows] = await Promise.all([
        queryCollection(event, "docs")
            .where("path", "LIKE", `${BENCHMARKS_PATH}%`)
            .select("path", "title", "description", "url", "kind", "verdict")
            .all(),
        readArtifact<DocsArtifact>("docs"),
        readArtifact<MetricsArtifact>("metrics"),
        readArtifact<UsageArtifact>("usage"),
        loadWorkflows(),
    ]);

    return {
        benchmarks: sortBenchmarks(toBenchmarks(pages)).map((benchmark) => ({
            id: benchmark.id,
            title: benchmark.title,
            screenshot: screenshotOf(benchmark),
        })),
        decisions: toDecisionReports(docs?.pages ?? []).map(({ id, number, title, status }) => ({
            id,
            number,
            title,
            status,
        })),
        workflows: {
            projects: workflows.projects.map((view) => ({
                id: view.project.id,
                title: view.project.title,
                map: projectMap(view),
            })),
            templates: workflows.templates
                .filter((template) => template.capabilities.length)
                .map(({ id, title, summary }) => ({ id, title, summary })),
            lessons: lessonCount(workflows.templates),
        },
        rules: ruleCounts(usage?.lint),
        specs: specTotal(metrics?.projects),
    };
});
