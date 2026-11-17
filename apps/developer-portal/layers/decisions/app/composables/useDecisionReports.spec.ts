import { serveEndpoint, withSetup } from "@monorepo/configs/vitest/utils/nuxt";
import { flushPromises } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";
import type { SnapshotResponse } from "#layers/snapshot/shared/types/SnapshotResponse.ts";
import { useDecisionReports } from "./useDecisionReports.ts";

const DECISION: DocPage = {
    path: "docs/decisions/0007-use-a-cache.md",
    kind: "decision",
    title: "🧭 Use a cache",
    words: 20,
    updatedAt: "2026-09-20",
    decisionStatus: "implemented",
    decisionOutcome: "accepted",
    decisionSupersededBy: null,
    audit: null,
    brokenLinks: [],
};

const serve = (docs: SnapshotResponse["docs"]) => {
    serveEndpoint("/api/snapshot/docs", (): SnapshotResponse => ({
        manifest: null,
        docs,
    }));
};

const use = async () => (await withSetup(() => useDecisionReports())).value;

describe("useDecisionReports", () => {
    it("returns no reports while the docs snapshot is absent", async () => {
        serve(null);
        const reports = await use();
        await flushPromises();

        expect(reports.value).toEqual([]);
    });

    it("derives a report from each decision page once the snapshot arrives", async () => {
        serve({
            generatedAt: "2026-11-01T00:00:00Z",
            pages: [DECISION, { ...DECISION, path: "docs/guides/x.md", kind: "doc" }],
            brokenLinkCount: 0,
        });
        const reports = await use();
        await flushPromises();

        expect(reports.value).toEqual([
            expect.objectContaining({ id: "0007-use-a-cache", title: "Use a cache" }),
        ]);
    });
});
