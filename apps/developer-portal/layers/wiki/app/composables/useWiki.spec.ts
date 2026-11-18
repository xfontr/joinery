import { withSetup } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useWiki } from "./useWiki.ts";

// An in-memory docs collection that records which fields a query asked for
const docs = vi.hoisted(() => ({
    entries: [] as { path: string; title: string }[],
    selected: [] as string[],
}));

mockNuxtImport("queryCollection", () => () => {
    const query = {
        select: (...fields: string[]) => {
            docs.selected = fields;
            return query;
        },
        all: () => Promise.resolve(docs.entries),
    };
    return query;
});

const use = async () =>
    (
        await withSetup(() => {
            clearNuxtData("wiki");
            return useWiki();
        })
    ).value;

beforeEach(() => {
    docs.selected = [];
    docs.entries = [
        { path: "README.md", title: "README" },
        { path: "docs/README.md", title: "Docs" },
    ];
});

describe("useWiki", () => {
    it("builds the wiki tree from the docs collection", async () => {
        const { data } = await use();

        expect(data.value).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: "workspace" }),
                expect.objectContaining({ id: "docs" }),
            ]),
        );
    });

    // Every page's payload carries the tree, so a page body in it would ship the whole wiki
    it("reads only the path and title of each page", async () => {
        await use();

        expect(docs.selected).toEqual(["path", "title"]);
    });

    it("builds an empty tree from an empty collection", async () => {
        docs.entries = [];
        const { data } = await use();

        expect(data.value).toEqual([]);
    });
});
