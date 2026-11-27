import { serveEndpoint, withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { createError, getQuery } from "h3";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { useRouter, type RouteLocationRaw } from "vue-router";
import { useArticleSearch } from "./useArticleSearch";

const SEARCH: ArticleSearch = {
    items: [],
    page: 1,
    perPage: 20,
    total: 30,
    totalPages: 2,
    query: "culpa",
    subjects: [],
};

const serveSearch = (rejectPage?: string) => {
    const received: Record<string, unknown>[] = [];

    serveEndpoint("/api/search", (event) => {
        const query = getQuery(event);

        received.push(query);

        if (rejectPage && query.page === rejectPage) throw createError({ statusCode: 404 });

        return SEARCH;
    });

    return received;
};

const searchAt = async (route: string) => {
    const { value } = await withSetup(
        async () => {
            // Before the await, which ends the component's injection context
            const router = useRouter();

            return { search: await useArticleSearch(), router };
        },
        { route },
    );

    return Object.assign(value.search, {
        router: value.router,
        href: (to: RouteLocationRaw) => value.router.resolve(to).href,
    });
};

// Navigating there imports the page's whole graph, which is slow cold
beforeAll(() => import("../pages/search.vue"));

// useCachedFetch serves a payload it already holds, which would outlive the test that fetched it
beforeEach(() => {
    clearNuxtData();
});

afterEach(() => {
    clearError();
});

describe("useArticleSearch", () => {
    it("sends the trimmed query and the page from the URL to the route", async () => {
        const received = serveSearch();

        await searchAt("/buscar/?query=%20culpa%20&page=2");

        expect(received).toEqual([{ query: "culpa", page: "2" }]);
    });

    it.each(["/buscar/", "/buscar/?query=%20%20", "/buscar/?query=a&query=b"])(
        "treats %s as the empty state and never asks the route",
        async (route) => {
            const received = serveSearch();

            const search = await searchAt(route);

            expect(received).toEqual([]);
            expect(search.term.value).toBe("");
        },
    );

    it("keeps the query in every page link and leaves page one out of it", async () => {
        serveSearch();

        const search = await searchAt("/buscar/?query=culpa&page=2");

        expect(search.href(search.pageLink(1))).toBe("/buscar/?query=culpa");
        expect(search.href(search.pageLink(3))).toBe("/buscar/?query=culpa&page=3");
    });

    it("starts a new query from its first page, and clears the URL for a blank one", async () => {
        serveSearch();

        const search = await searchAt("/buscar/?query=culpa&page=2");
        const { router } = search;

        search.term.value = "  dolo ";
        await vi.waitFor(() =>
            expect(router.currentRoute.value.fullPath).toBe("/buscar/?query=dolo"),
        );

        search.term.value = " ";
        await vi.waitFor(() => expect(router.currentRoute.value.fullPath).toBe("/buscar/"));
    });

    it("shows the route's 404 when a later page is rejected", async () => {
        serveSearch("99");

        const search = await searchAt("/buscar/?query=culpa");

        await search.router.push("/buscar/?query=culpa&page=99");

        await vi.waitFor(() => expect(useError().value).toMatchObject({ status: 404 }));
    });

    it("fails the first render with a 404 when the URL holds a page past the end", async () => {
        serveSearch("99");

        await expect(searchAt("/buscar/?query=culpa&page=99")).rejects.toMatchObject({
            status: 404,
        });
    });
});
