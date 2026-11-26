import { withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";
import type { DocsArtifact } from "#layers/snapshot/shared/types/DocsArtifact.ts";
import { useDecisionReports } from "./useDecisionReports.ts";

const artifacts = vi.hoisted(() => ({ docs: null as DocsArtifact | null }));
mockNuxtImport("docsArtifact", () => () => artifacts.docs);

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

const serve = (docs: DocsArtifact | null) => {
    artifacts.docs = docs;
};

const use = async () => (await withSetup(() => useDecisionReports())).value;

describe("useDecisionReports", () => {
    it("returns no reports while the docs snapshot is absent", async () => {
        serve(null);
        const reports = await use();

        expect(reports.value).toEqual([]);
    });

    it("derives a report from each decision page and skips the other docs", async () => {
        serve({
            generatedAt: "2026-11-01T00:00:00Z",
            pages: [DECISION, { ...DECISION, path: "docs/guides/x.md", kind: "doc" }],
            brokenLinkCount: 0,
        });
        const reports = await use();

        expect(reports.value).toEqual([
            expect.objectContaining({ id: "0007-use-a-cache", title: "Use a cache" }),
        ]);
    });
});
