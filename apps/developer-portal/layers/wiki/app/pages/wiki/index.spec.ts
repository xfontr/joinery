import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";
import type { SnapshotResponse } from "#layers/snapshot/shared/types/SnapshotResponse.ts";
import Page from "./index.vue";

// An in-memory docs collection, which the real useWiki groups into sections
const docs = vi.hoisted(() => ({ entries: [] as { path: string; title: string }[] }));

mockNuxtImport("queryCollection", () => () => {
    const query = { select: () => query, all: () => Promise.resolve(docs.entries) };
    return query;
});

// The nav has its own spec; here only that the page hands it the wiki
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
    serveEndpoint("/api/snapshot/docs", (): SnapshotResponse => ({
        manifest: null,
        docs: {
            generatedAt: "2026-11-01T00:00:00Z",
            pages,
            brokenLinkCount: pages.filter((found) => found.brokenLinks.length > 0).length,
        },
    }));
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
                "/docs/readme",
                "/docs/docs/concepts/boundaries",
                "/docs/docs/guides/first-hour",
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

        expect(hrefs(wrapper)).toContain("/docs/docs/missing");
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

        expect(wrapper.text()).toContain("Nothing collected yet");
    });
});
