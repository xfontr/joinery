import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";
import type { DocsArtifact } from "#layers/snapshot/shared/types/DocsArtifact.ts";
import Page from "./index.vue";

const artifacts = vi.hoisted(() => ({ docs: null as DocsArtifact | null }));
mockNuxtImport("docsArtifact", () => () => artifacts.docs);

beforeEach(() => {
    artifacts.docs = null;
});

const docs = vi.hoisted(() => ({ entries: [] as { path: string; title: string }[] }));

mockNuxtImport("queryCollection", () => () => {
    const query = { select: () => query, all: () => Promise.resolve(docs.entries) };
    return query;
});

const WikiNav = { props: { sections: Array }, template: "<nav />" };
const global = { stubs: { WikiNav } };

const page = (path: string, overrides: Partial<DocPage> = {}): DocPage => ({
    path,
    kind: "doc",
    title: path,
    words: 100,
    updatedAt: "2026-09-20",
    decisionStatus: null,
    decisionOutcome: null,
    decisionSupersededBy: null,
    audit: null,
    brokenLinks: [],
    ...overrides,
});

const serve = (pages: DocPage[]) => {
    artifacts.docs = {
        generatedAt: "2026-11-01T00:00:00Z",
        pages,
        brokenLinkCount: pages.filter((found) => found.brokenLinks.length > 0).length,
    };
};

const hrefs = (wrapper: VueWrapper) => wrapper.findAll("a").map((a) => a.attributes("href"));

beforeEach(() => {
    docs.entries = [
        { path: "/readme", title: "The repo" },
        { path: "/docs/concepts/boundaries", title: "Boundaries" },
        { path: "/docs/guides/first-hour", title: "First hour" },
    ];
});

describe("docs index page", () => {
    it("routes the newcomer entries through /docs, and the overview ones to their pages", async () => {
        serve([]);
        const wrapper = await mountSuspended(Page, { global });

        expect(hrefs(wrapper)).toEqual(
            expect.arrayContaining([
                "/wiki/readme",
                "/wiki/docs/concepts/boundaries",
                "/wiki/docs/guides/first-hour",
                "/projects",
                "/graph",
            ]),
        );
    });

    it("links every page with a broken link so it can be fixed", async () => {
        serve([
            page("docs/guides/first-hour.md"),
            page("docs/missing.md", {
                brokenLinks: [{ href: "./gone", resolved: "docs/gone.md" }],
            }),
        ]);
        const wrapper = await mountSuspended(Page, { global });

        expect(hrefs(wrapper)).toContain("/wiki/docs/missing");
    });

    it("hands the nav the wiki built from the docs collection", async () => {
        serve([]);
        const wrapper = await mountSuspended(Page, { global });

        expect(wrapper.findComponent(WikiNav).props("sections")).not.toHaveLength(0);
    });

    it("keeps an empty collected wiki visibly empty", async () => {
        docs.entries = [];
        serve([]);
        const wrapper = await mountSuspended(Page, { global });

        expect(wrapper.text()).toContain("wikiRecent.empty");
    });
});
