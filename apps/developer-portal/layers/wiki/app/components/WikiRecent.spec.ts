import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";
import WikiRecent from "./WikiRecent.vue";

const page = (path: string, updatedAt: string | null): DocPage => ({
    path,
    kind: "doc",
    title: path,
    words: 0,
    updatedAt,
    decisionStatus: null,
    decisionOutcome: null,
    decisionSupersededBy: null,
    audit: null,
});

describe("WikiRecent", () => {
    it("lists the pages in the tree, newest first, leaving out the rest", async () => {
        const wrapper = await mountSuspended(WikiRecent, {
            props: {
                pages: [
                    page("docs/old.md", "2026-10-01T00:00:00Z"),
                    page("docs/new.md", "2026-11-01T00:00:00Z"),
                    page("docs/hidden.md", "2026-11-02T00:00:00Z"),
                    page("docs/undated.md", null),
                ],
                known: new Set(["/docs/old", "/docs/new", "/docs/undated"]),
            },
        });

        expect(wrapper.findAll("a span.font-mono").map((path) => path.text())).toEqual([
            "docs/new.md",
            "docs/old.md",
        ]);
    });
});
