import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";
import WikiBroken from "./WikiBroken.vue";

const page = (path: string, hrefs: string[]): DocPage => ({
    path,
    kind: "doc",
    title: path,
    words: 0,
    updatedAt: null,
    decisionStatus: null,
    decisionOutcome: null,
    decisionSupersededBy: null,
    audit: null,
    brokenLinks: hrefs.map((href) => ({ href, resolved: href })),
});

describe("WikiBroken", () => {
    it("links each page with a broken link, naming the targets", async () => {
        const wrapper = await mountSuspended(WikiBroken, {
            props: { pages: [page("docs/a.md", ["./gone.md", "../x.md"]), page("docs/b.md", [])] },
        });

        const links = wrapper.findAll("a");
        expect(links).toHaveLength(1);
        expect(links[0]?.text()).toContain("./gone.md, ../x.md");
    });
});
