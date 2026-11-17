import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";
import type { SnapshotResponse } from "#layers/snapshot/shared/types/SnapshotResponse.ts";
import Page from "./[...slug].vue";

// An in-memory docs collection, answering useWiki's listing and the page's own lookup
const docs = vi.hoisted(() => ({
    entries: [] as { path: string; title: string; body?: unknown }[],
}));

mockNuxtImport("queryCollection", () => () => {
    const query = {
        select: () => query,
        all: () => Promise.resolve(docs.entries),
        path: (path: string) => ({
            first: () => Promise.resolve(docs.entries.find((entry) => entry.path === path) ?? null),
        }),
    };
    return query;
});

// Only a server render can set a status; the prerender crawler is what reads it
const setStatus = vi.hoisted(() => vi.fn());
mockNuxtImport("setResponseStatus", () => setStatus);

const global = {
    stubs: {
        ContentRenderer: { props: { value: Object }, template: "<div>{{ value?.title }}</div>" },
    },
};

const page = (path: string, overrides: Partial<DocPage> = {}): DocPage => ({
    path,
    kind: "doc",
    title: path,
    words: 10,
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
        docs: { generatedAt: "2026-11-01T00:00:00Z", pages, brokenLinkCount: 0 },
    }));
};

const FIRST_HOUR = "/wiki/docs/guides/first-hour";

beforeEach(() => {
    setStatus.mockClear();
    docs.entries = [
        {
            path: "/docs/guides/first-hour",
            title: "First hour",
            body: { toc: { links: [{ id: "intro", depth: 2, text: "Intro" }] } },
        },
        { path: "/docs/guides/next", title: "Next" },
    ];
    serve([
        page("docs/guides/first-hour.md", {
            brokenLinks: [{ href: "./missing", resolved: "docs/guides/missing.md" }],
        }),
    ]);
});

describe("doc detail page", () => {
    it("answers a missing page with a 404 so the prerender crawler fails on a dead link", async () => {
        await mountSuspended(Page, { global, route: "/wiki/docs/guides/nope" });

        expect(setStatus).toHaveBeenCalledWith(404);
    });

    it("leaves a found page on 200", async () => {
        await mountSuspended(Page, { global, route: FIRST_HOUR });

        expect(setStatus).not.toHaveBeenCalled();
    });

    it("warns about the page's broken links, naming each one", async () => {
        const wrapper = await mountSuspended(Page, { global, route: FIRST_HOUR });

        expect(wrapper.text()).toContain("This page links to something that is not there");
        expect(wrapper.text()).toContain("./missing");
    });

    it("links the next page in the same group", async () => {
        const wrapper = await mountSuspended(Page, { global, route: FIRST_HOUR });

        expect(wrapper.find("a[href='/wiki/docs/guides/next']").exists()).toBe(true);
    });

    it("hands the page's headings to the table of contents", async () => {
        const wrapper = await mountSuspended(Page, { global, route: FIRST_HOUR });

        expect(wrapper.findComponent({ name: "UContentToc" }).props("links")).toEqual([
            { id: "intro", depth: 2, text: "Intro" },
        ]);
    });

    it("says there is no such page instead of rendering an empty one", async () => {
        const wrapper = await mountSuspended(Page, { global, route: "/wiki/docs/guides/nope" });

        expect(wrapper.text()).toContain("No such page");
    });

    it("loads the new page when the route changes under it", async () => {
        const wrapper = await mountSuspended(Page, { global, route: FIRST_HOUR });

        await useRouter().push("/wiki/docs/guides/next");
        await flushPromises();

        expect(wrapper.text()).toContain("docs/guides/next.md");
        expect(wrapper.find("a[href='/wiki/docs/guides/first-hour']").exists()).toBe(true);
    });
});
