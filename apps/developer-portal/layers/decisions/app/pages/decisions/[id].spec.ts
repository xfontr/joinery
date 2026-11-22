import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DecisionOutcome, DecisionStatus } from "#layers/snapshot/shared/decisions.ts";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";
import type { DocsArtifact } from "#layers/snapshot/shared/types/DocsArtifact.ts";
import Page from "./[id].vue";

const artifacts = vi.hoisted(() => ({ docs: null as DocsArtifact | null }));
mockNuxtImport("docsArtifact", () => () => artifacts.docs);

beforeEach(() => {
    artifacts.docs = null;
});

const docs = vi.hoisted(() => ({
    entries: [] as { path: string; title: string; body?: unknown }[],
}));

mockNuxtImport("queryCollection", () => () => ({
    path: (path: string) => ({
        first: () => Promise.resolve(docs.entries.find((entry) => entry.path === path) ?? null),
    }),
}));

const setStatus = vi.hoisted(() => vi.fn());
mockNuxtImport("setResponseStatus", () => setStatus);

const global = {
    stubs: {
        ContentRenderer: { props: { value: Object }, template: "<div>{{ value?.title }}</div>" },
    },
};

const report = (
    id: string,
    decisionStatus: DecisionStatus,
    decisionOutcome: DecisionOutcome,
    decisionSupersededBy: string | null = null,
): DocPage => ({
    path: `docs/decisions/${id}.md`,
    kind: "decision",
    title: id,
    words: 10,
    updatedAt: "2026-09-20",
    decisionStatus,
    decisionOutcome,
    decisionSupersededBy,
    audit: null,
    brokenLinks: [],
});

const open = async (route: string) => {
    const wrapper = await mountSuspended(Page, { global, route });
    await flushPromises();
    return wrapper;
};

const pills = (wrapper: VueWrapper) =>
    wrapper.findAllComponents({ name: "StatusPill" }).map((pill) => pill.props());

beforeEach(() => {
    setStatus.mockClear();
    docs.entries = [
        { path: "/docs/decisions/0001-first", title: "First" },
        { path: "/docs/decisions/0002-second", title: "Second" },
        { path: "/docs/decisions/0003-third", title: "Third" },
    ];
    artifacts.docs = {
        generatedAt: "2026-11-01T00:00:00Z",
        pages: [
            report("0001-first", "implemented", "accepted"),
            report("0002-second", "to-implement", "superseded", "0003-third.md"),
            report("0003-third", "implemented", "accepted"),
        ],
        brokenLinkCount: 0,
    };
});

describe("decision detail page", () => {
    it("answers a missing report with a 404 so the prerender crawler fails on a dead link", async () => {
        await open("/decisions/missing");

        expect(setStatus).toHaveBeenCalledWith(404);
    });

    it("leaves a found report on 200", async () => {
        await open("/decisions/0002-second");

        expect(setStatus).not.toHaveBeenCalled();
    });

    it("shows the report's status and links a superseded one to its replacement", async () => {
        const wrapper = await open("/decisions/0002-second");

        expect(pills(wrapper)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ to: "/decisions/0003-third" }),
                expect.objectContaining({ label: "To implement" }),
            ]),
        );
    });

    it("links both neighbours in decision order", async () => {
        const wrapper = await open("/decisions/0002-second");

        expect(wrapper.find("a[href='/decisions/0001-first']").exists()).toBe(true);
        expect(wrapper.find("a[href='/decisions/0003-third']").exists()).toBe(true);
    });

    it.each([
        ["first", "/decisions/0001-first", "/decisions/0002-second", "/decisions/0001-first"],
        ["last", "/decisions/0003-third", "/decisions/0002-second", "/decisions/0003-third"],
    ])("links only the one neighbour the %s report has", async (_, route, linked, self) => {
        const wrapper = await open(route);

        expect(wrapper.find(`a[href='${linked}']`).exists()).toBe(true);
        expect(wrapper.find(`a[href='${self}']`).exists()).toBe(false);
    });

    it("says there is no such report instead of rendering an empty one", async () => {
        const wrapper = await open("/decisions/missing");

        expect(wrapper.text()).toContain("No such report");
    });

    it("loads the new report when the route changes under it", async () => {
        const wrapper = await open("/decisions/0001-first");

        await useRouter().push("/decisions/0003-third");
        await flushPromises();

        expect(wrapper.find("a[href='/decisions/0003-third']").exists()).toBe(false);
        expect(wrapper.find("a[href='/decisions/0002-second']").exists()).toBe(true);
    });
});
