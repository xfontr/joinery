import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DecisionOutcome, DecisionStatus } from "#layers/snapshot/shared/decisions.ts";
import type { DocPage } from "#layers/snapshot/shared/types/DocPage.ts";
import type { DocsArtifact } from "#layers/snapshot/shared/types/DocsArtifact.ts";
import Page from "./index.vue";

const artifacts = vi.hoisted(() => ({ docs: null as DocsArtifact | null }));
mockNuxtImport("docsArtifact", () => () => artifacts.docs);

beforeEach(() => {
    artifacts.docs = null;
});

const report = (
    id: string,
    decisionStatus: DecisionStatus,
    decisionOutcome: DecisionOutcome,
    title: string,
    updatedAt: string,
    decisionSupersededBy: string | null = null,
): DocPage => ({
    path: `docs/decisions/${id}.md`,
    kind: "decision",
    title,
    words: 10,
    updatedAt,
    decisionStatus,
    decisionOutcome,
    decisionSupersededBy,
    audit: null,
    brokenLinks: [],
});

const NEW = report("0002-new", "implemented", "accepted", "New", "2026-09-20");
const OLD = report("0001-old", "to-implement", "superseded", "Old", "2026-09-19", "0002-new.md");

type Wrapper = VueWrapper;

const open = async (pages: DocPage[] = [NEW, OLD]) => {
    artifacts.docs = { generatedAt: "2026-11-01T00:00:00Z", pages, brokenLinkCount: 0 };
    const wrapper = await mountSuspended(Page);
    await flushPromises();
    return wrapper;
};

const listed = (wrapper: Wrapper) =>
    wrapper.findAll("a[href^='/decisions/']").map((link) => link.attributes("href"));

/** The select offering `value`, found by what it filters rather than where it sits. */
const selectOffering = (wrapper: Wrapper, value: string) =>
    wrapper
        .findAllComponents({ name: "USelect" })
        .find((select) =>
            (select.props("items") as { value: string }[]).some((item) => item.value === value),
        )!;

const tiles = (wrapper: Wrapper) =>
    Object.fromEntries(
        wrapper
            .findAllComponents({ name: "StatTile" })
            .map((tile) => [tile.props("label"), tile.props("value")]),
    );

describe("decisions index page", () => {
    it("counts every report by status, however narrow the visible list", async () => {
        const wrapper = await open();

        await wrapper.find("input").setValue("New");

        expect(listed(wrapper)).toEqual(["/decisions/0002-new"]);
        expect(tiles(wrapper)).toMatchObject({
            "decisions.status.implemented": 1,
            "decisions.status.to-implement": 1,
        });
    });

    it("narrows the list to the status picked", async () => {
        const wrapper = await open();

        await selectOffering(wrapper, "to-implement").setValue("to-implement");

        expect(listed(wrapper)).toEqual(["/decisions/0001-old"]);
    });

    it("narrows the list to the decision outcome picked", async () => {
        const wrapper = await open();

        await selectOffering(wrapper, "superseded").setValue("accepted");

        expect(listed(wrapper)).toEqual(["/decisions/0002-new"]);
    });

    it.each([
        ["newest", ["/decisions/0002-new", "/decisions/0001-old"]],
        ["oldest", ["/decisions/0001-old", "/decisions/0002-new"]],
    ])("orders the list %s first when asked", async (sort, order) => {
        const wrapper = await open();

        await selectOffering(wrapper, "oldest").setValue(sort);

        expect(listed(wrapper)).toEqual(order);
    });

    it("names the replacement of a superseded report beside it", async () => {
        const wrapper = await open();
        const hints = wrapper
            .findAllComponents({ name: "StatusPill" })
            .map((pill) => pill.props("hint"));

        expect(hints).toContain("decisions.supersededBy");
    });

    it("says nothing matches instead of showing an empty list", async () => {
        const wrapper = await open();

        await wrapper.find("input").setValue("missing");

        expect(listed(wrapper)).toEqual([]);
        expect(wrapper.text()).toContain("listCard.empty");
    });
});
