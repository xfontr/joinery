import { describe, expect, it } from "vitest";
import { brokenPages } from "./docs.ts";
import type { DocPage } from "../../shared/types/DocPage.ts";

const page = (path: string, broken: number): DocPage => ({
    path,
    kind: "doc",
    title: path,
    words: 10,
    updatedAt: null,
    decisionStatus: null,
    decisionOutcome: null,
    decisionSupersededBy: null,
    audit: null,
    brokenLinks: Array.from({ length: broken }, (_, index) => ({
        href: `./gone-${index}.md`,
        resolved: `gone-${index}.md`,
    })),
});

describe("brokenPages", () => {
    it("keeps only the pages with a broken link", () => {
        const docs = {
            generatedAt: "",
            pages: [page("a.md", 0), page("b.md", 2)],
            brokenLinkCount: 2,
        };

        expect(brokenPages(docs).map((item) => item.path)).toEqual(["b.md"]);
    });

    it("lists nothing when the docs were never collected", () => {
        expect(brokenPages(null)).toEqual([]);
    });
});
