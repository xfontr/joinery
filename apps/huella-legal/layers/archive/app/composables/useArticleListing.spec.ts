import { serveEndpoint, withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { createError, getQuery } from "h3";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRouter, type RouteLocationRaw } from "vue-router";
import { useArticleListing } from "./useArticleListing";

const LISTING: ArticleListing = {
    items: [],
    page: 1,
    perPage: 20,
    total: 30,
    totalPages: 2,
    formats: [
        { value: "articulo", count: 25 },
        { value: "comentario", count: 5 },
    ],
    subjects: [],
};

const serveListing = (listing: ArticleListing = LISTING, rejectPage?: string) => {
    const received: Record<string, unknown>[] = [];

    serveEndpoint("/api/articles", (event) => {
        const query = getQuery(event);

        received.push(query);

        if (rejectPage && query.page === rejectPage) throw createError({ statusCode: 404 });

        return listing;
    });

    return received;
};

const listingAt = async (query: string, scope?: Parameters<typeof useArticleListing>[0]) => {
    const { value } = await withSetup(
        async () => {
            // Before the await, which ends the component's injection context
            const router = useRouter();

            return { listing: await useArticleListing(scope), router };
        },
        { route: `/publicaciones/${query}` },
    );

    return Object.assign(value.listing, {
        router: value.router,
        href: (to: RouteLocationRaw) => value.router.resolve(to).href,
    });
};

// useCachedFetch serves a payload it already holds, which would outlive the test that fetched it
beforeEach(() => {
    clearNuxtData();
});

afterEach(() => {
    clearError();
});

describe("useArticleListing", () => {
    it("reads page, sort, format and query from the URL and sends them to the route with the scope", async () => {
        const received = serveListing();

        const listing = await listingAt("?page=2&sort=oldest&format=comentario&query=culpa", {
            category: "derecho-civil",
        });

        expect(received).toEqual([
            {
                category: "derecho-civil",
                page: "2",
                sort: "oldest",
                format: "comentario",
                query: "culpa",
            },
        ]);
        expect(listing.sort.value).toBe("oldest");
        expect(listing.search.value).toBe("culpa");
    });

    it("builds its links against page one and newest, so the defaults stay out of every address", async () => {
        serveListing();

        const listing = await listingAt("?page=2&sort=newest&format=comentario");

        expect(listing.href(listing.pageLink(1))).toBe("/publicaciones/?format=comentario");
        expect(listing.href(listing.pageLink(3))).toBe("/publicaciones/?page=3&format=comentario");
    });

    it("reads an unknown sort as newest and a missing query as blank", async () => {
        serveListing();

        const listing = await listingAt("?sort=sideways");

        expect(listing.sort.value).toBe("newest");
        expect(listing.search.value).toBe("");
    });

    it("navigates to a new sort", async () => {
        serveListing();

        const listing = await listingAt("");

        listing.sort.value = "oldest";

        await vi.waitFor(() =>
            expect(listing.router.currentRoute.value.fullPath).toBe("/publicaciones/?sort=oldest"),
        );
    });

    it("navigates to a trimmed query, and drops it when blank", async () => {
        serveListing();

        const listing = await listingAt("");

        listing.search.value = "  culpa ";
        await vi.waitFor(() =>
            expect(listing.router.currentRoute.value.fullPath).toBe("/publicaciones/?query=culpa"),
        );

        listing.search.value = " ";
        await vi.waitFor(() =>
            expect(listing.router.currentRoute.value.fullPath).toBe("/publicaciones/"),
        );
    });

    it("links each page by its number as a string, the way the URL holds it", async () => {
        serveListing();

        const listing = await listingAt("");

        expect(listing.href(listing.pageLink(3))).toBe("/publicaciones/?page=3");
    });

    it("totals every format in the first pill and marks the one the URL selects", async () => {
        serveListing();

        const listing = await listingAt("?format=comentario");

        expect(listing.archiveTotal.value).toBe(30);
        expect(
            listing.formatPills.value.map(({ count, active, to }) => ({
                count,
                active,
                to: listing.href(to),
            })),
        ).toEqual([
            { count: 30, active: false, to: "/publicaciones/" },
            { count: 25, active: false, to: "/publicaciones/?format=articulo" },
            { count: 5, active: true, to: "/publicaciones/?format=comentario" },
        ]);
    });

    it("drops the pills when the listing has a single format to choose from", async () => {
        serveListing({ ...LISTING, formats: [{ value: "articulo", count: 30 }] });

        const listing = await listingAt("");

        expect(listing.formatPills.value).toEqual([]);
    });

    it("shows the route's 404 when a later page or sort is rejected", async () => {
        serveListing(LISTING, "99");

        const listing = await listingAt("");

        await listing.router.push("/publicaciones/?page=99");

        await vi.waitFor(() => expect(useError().value).toMatchObject({ status: 404 }));
    });

    it("fails the first render with a 404 when the URL holds a page past the end", async () => {
        serveListing(LISTING, "99");

        await expect(listingAt("?page=99")).rejects.toMatchObject({ status: 404 });
    });
});
