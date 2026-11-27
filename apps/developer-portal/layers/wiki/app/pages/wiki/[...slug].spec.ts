import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";
import type { DocsArtifact } from "#layers/snapshot/shared/types/DocsArtifact.ts";
import Page from "./[...slug].vue";

const artifacts = vi.hoisted(() => ({ docs: null as DocsArtifact | null }));
mockNuxtImport("docsArtifact", () => () => artifacts.docs);

beforeEach(() => {
    artifacts.docs = null;
});

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
    ...overrides,
});

const serve = (pages: DocPage[]) => {
    artifacts.docs = { generatedAt: "2026-11-01T00:00:00Z", pages };
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
    serve([page("docs/guides/first-hour.md")]);
});

describe("doc detail page", () => {
    it("answers a missing page with a 404 so the prerender crawler fails on a dead link", async () => {
        await mountSuspended(Page, { global, route: "/wiki/docs/guides/nope" });

        expect(setStatus).toHaveBeenCalledWith(404);
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

    it("loads the new page when the route changes under it", async () => {
        const wrapper = await mountSuspended(Page, { global, route: FIRST_HOUR });

        await useRouter().push("/wiki/docs/guides/next");
        await flushPromises();

        expect(wrapper.text()).toContain("docs/guides/next.md");
        expect(wrapper.find("a[href='/wiki/docs/guides/first-hour']").exists()).toBe(true);
    });
});
