import { serveEndpoint, withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { getQuery } from "h3";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref, type Ref } from "vue";
import { useSearchPreview } from "./useSearchPreview";

const HOME: Home = { latest: [], recent: [], theses: [], subjects: [], formats: [] };

const RESULT: ArticleSearch = {
    items: [],
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 0,
    query: "dolo",
    subjects: [],
};

const serve = (search: () => unknown = () => RESULT) => {
    const home: unknown[] = [];
    const searches: Record<string, unknown>[] = [];

    serveEndpoint("/api/home", () => {
        home.push(true);

        return HOME;
    });
    serveEndpoint("/api/search", (event) => {
        searches.push(getQuery(event));

        return search();
    });

    return { home, searches };
};

const previewOf = async (term: Ref<string>) =>
    (await withSetup(() => useSearchPreview(term))).value;

// useCachedFetch serves a payload it already holds, which would outlive the test that fetched it
beforeEach(() => {
    clearNuxtData();
});

describe("useSearchPreview", () => {
    it("asks for the home payload too, since that is what fills the palette before any typing", async () => {
        serve();

        const preview = await previewOf(ref(""));

        await vi.waitFor(() => expect(preview.home.value).toEqual(HOME));
    });

    it("never searches for a blank term, which the route would answer with a 404", async () => {
        const { home, searches } = serve();

        await previewOf(ref("   "));

        await vi.waitFor(() => expect(home).toHaveLength(1));
        expect(searches).toEqual([]);
    });

    it("searches only once typing pauses, so each keystroke is not a WordPress request", async () => {
        const { searches } = serve();
        const term = ref("");
        const preview = await previewOf(term);

        term.value = "dol";
        await nextTick();
        term.value = " dolo ";
        await nextTick();

        expect(preview.pending.value).toBe(true);
        expect(searches).toEqual([]);

        await vi.waitFor(() => expect(preview.search.value).toEqual(RESULT));

        expect(searches).toEqual([{ query: "dolo" }]);
        expect(preview.pending.value).toBe(false);
    });

    it("stays pending while the search is in flight, so stale matches are not taken as current", async () => {
        let release!: () => void;
        const { searches } = serve(
            () => new Promise<ArticleSearch>((resolve) => (release = () => resolve(RESULT))),
        );
        const term = ref("");
        const preview = await previewOf(term);

        term.value = "dolo";
        await vi.waitFor(() => expect(searches).toHaveLength(1));

        expect(preview.pending.value).toBe(true);

        release();
        await vi.waitFor(() => expect(preview.pending.value).toBe(false));
    });
});
